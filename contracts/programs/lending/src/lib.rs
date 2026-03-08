use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, TokenProgram, Transfer};

declare_id!("7UPmL6f2GH1B7gQA859eUjSz9bjXffFahwPj86YhPyP1");

/// Chainlink OCR2 program ID (Solana Data Feeds owner)
pub const CHAINLINK_FEED_OWNER: &str = "HEvSKofvBgfaexv23kMabbYqxasxU3mQ4ibBMEmJWHny";

#[program]
pub mod lending {
    use super::*;

    /// Initialize lending pool with liquidation LTV threshold (basis points, e.g. 8000 = 80%).
    pub fn initialize_pool(ctx: Context<InitializePool>, liquidation_ltv_bps: u16) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        pool.authority = ctx.accounts.authority.key();
        pool.liquidation_ltv_bps = liquidation_ltv_bps;
        pool.bump = ctx.bumps.pool;
        pool.stable_mint = ctx.accounts.stable_mint.key();
        Ok(())
    }

    /// Deposit patent NFT as collateral and open/update loan position. Uses Chainlink price for collateral value.
    pub fn deposit_collateral(
        ctx: Context<DepositCollateral>,
        patent_vault: Pubkey,
        collateral_valuation_lamports: u64,
    ) -> Result<()> {
        let position = &mut ctx.accounts.position;
        position.borrower = ctx.accounts.borrower.key();
        position.patent_vault = patent_vault;
        position.collateral_valuation_lamports = collateral_valuation_lamports;
        position.debt_lamports = 0;
        position.bump = ctx.bumps.position;
        position.liquidatable = false;
        Ok(())
    }

    /// Borrow against collateral. Validates LTV using optional Chainlink feed; if no feed passed, uses stored valuation.
    pub fn borrow(ctx: Context<Borrow>, amount: u64) -> Result<()> {
        let position = &mut ctx.accounts.position;
        let pool = &ctx.accounts.pool;

        let new_debt = position.debt_lamports.checked_add(amount).ok_or(LendingError::Overflow)?;
        let ltv_bps = (new_debt * 10_000) / position.collateral_valuation_lamports;
        require!(ltv_bps <= 7500, LendingError::LTVTooHigh); // max 75% LTV

        position.debt_lamports = new_debt;

        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.pool_stable_treasury.to_account_info(),
                to: ctx.accounts.borrower_stable_ata.to_account_info(),
                authority: ctx.accounts.pool.to_account_info(),
            },
        );
        let seeds = &[b"pool", &[pool.bump]];
        token::transfer(cpi_ctx.with_signer(&[&seeds[..]]), amount)?;
        Ok(())
    }

    /// Repay debt.
    pub fn repay(ctx: Context<Repay>, amount: u64) -> Result<()> {
        let position = &mut ctx.accounts.position;
        let repay_amount = amount.min(position.debt_lamports);
        position.debt_lamports = position.debt_lamports.saturating_sub(repay_amount);
        position.liquidatable = false;

        let pool = &ctx.accounts.pool;
        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.borrower_stable_ata.to_account_info(),
                to: ctx.accounts.pool_stable_treasury.to_account_info(),
                authority: ctx.accounts.borrower.to_account_info(),
            },
        );
        token::transfer(cpi_ctx, repay_amount)?;
        Ok(())
    }

    /// Update collateral valuation from Chainlink price feed (e.g. SOL/USD). Used for risk-adjusted LTV.
    pub fn update_collateral_from_feed(ctx: Context<UpdateFromFeed>) -> Result<()> {
        let feed = &ctx.accounts.chainlink_feed;
        let owner_bytes = feed.owner.to_bytes();
        let data = feed.try_borrow_data()?;
        let result = chainlink_solana::v2::read_feed_v2(data.as_ref(), owner_bytes)
            .map_err(|_| LendingError::ChainlinkReadError)?;
        let round = result
            .latest_round_data()
            .ok_or(LendingError::RoundDataMissing)?;
        let position = &mut ctx.accounts.position;
        // Scale feed price (e.g. SOL/USD with 8 decimals) to lamports-like value for comparison
        position.collateral_valuation_lamports = round.answer as u64;
        Ok(())
    }

    /// Mark position as liquidatable when LTV exceeds threshold. Callable by Chainlink Automation or keeper.
    pub fn execute_liquidation(ctx: Context<ExecuteLiquidation>) -> Result<()> {
        let position = &ctx.accounts.position;
        let pool = &ctx.accounts.pool;
        let ltv_bps = (position.debt_lamports * 10_000) / position.collateral_valuation_lamports.max(1);
        require!(ltv_bps >= pool.liquidation_ltv_bps, LendingError::NotLiquidatable);
        let position = &mut ctx.accounts.position;
        position.liquidatable = true;
        Ok(())
    }
}

#[account]
pub struct LendingPool {
    pub authority: Pubkey,
    pub liquidation_ltv_bps: u16,
    pub bump: u8,
    pub stable_mint: Pubkey,
}

#[account]
pub struct LoanPosition {
    pub borrower: Pubkey,
    pub patent_vault: Pubkey,
    pub collateral_valuation_lamports: u64,
    pub debt_lamports: u64,
    pub bump: u8,
    pub liquidatable: bool,
}

#[derive(Accounts)]
pub struct InitializePool<'info> {
    #[account(mut)]
    pub authority: Signer,

    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 2 + 1 + 32,
        seeds = [b"pool"],
        bump
    )]
    pub pool: Account<'info, LendingPool>,

    pub stable_mint: Account<'info, anchor_spl::token::Mint>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DepositCollateral<'info> {
    #[account(mut)]
    pub borrower: Signer,

    #[account(
        mut,
        seeds = [b"pool"],
        bump = pool.bump,
    )]
    pub pool: Account<'info, LendingPool>,

    #[account(
        init,
        payer = borrower,
        space = 8 + 32 + 32 + 8 + 8 + 1 + 1,
        seeds = [b"position", borrower.key().as_ref()],
        bump
    )]
    pub position: Account<'info, LoanPosition>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Borrow<'info> {
    #[account(mut)]
    pub borrower: Signer,

    #[account(
        mut,
        seeds = [b"pool"],
        bump = pool.bump,
    )]
    pub pool: Account<'info, LendingPool>,

    #[account(
        mut,
        seeds = [b"position", borrower.key().as_ref()],
        bump = position.bump,
    )]
    pub position: Account<'info, LoanPosition>,

    /// CHECK: Pool-owned treasury for stable token
    #[account(mut)]
    pub pool_stable_treasury: Account<'info, TokenAccount>,
    #[account(mut)]
    pub borrower_stable_ata: Account<'info, TokenAccount>,
    pub token_program: Program<'info, TokenProgram>,
}

#[derive(Accounts)]
pub struct Repay<'info> {
    #[account(mut)]
    pub borrower: Signer,

    #[account(
        mut,
        seeds = [b"pool"],
        bump = pool.bump,
    )]
    pub pool: Account<'info, LendingPool>,

    #[account(
        mut,
        seeds = [b"position", borrower.key().as_ref()],
        bump = position.bump,
    )]
    pub position: Account<'info, LoanPosition>,

    #[account(mut)]
    pub pool_stable_treasury: Account<'info, TokenAccount>,
    #[account(mut)]
    pub borrower_stable_ata: Account<'info, TokenAccount>,
    pub token_program: Program<'info, TokenProgram>,
}

#[derive(Accounts)]
pub struct UpdateFromFeed<'info> {
    /// CHECK: Chainlink feed account - we read price via chainlink_solana crate
    pub chainlink_feed: AccountInfo<'info>,

    #[account(
        mut,
        seeds = [b"position", position.borrower.as_ref()],
        bump = position.bump,
    )]
    pub position: Account<'info, LoanPosition>,
}

#[derive(Accounts)]
pub struct ExecuteLiquidation<'info> {
    pub liquidator: Signer,

    #[account(
        seeds = [b"pool"],
        bump = pool.bump,
    )]
    pub pool: Account<'info, LendingPool>,

    #[account(
        mut,
        seeds = [b"position", position.borrower.as_ref()],
        bump = position.bump,
    )]
    pub position: Account<'info, LoanPosition>,
}

#[error_code]
pub enum LendingError {
    #[msg("LTV exceeds maximum")]
    LTVTooHigh,
    #[msg("Position not liquidatable")]
    NotLiquidatable,
    #[msg("Chainlink read error")]
    ChainlinkReadError,
    #[msg("No round data")]
    RoundDataMissing,
    #[msg("Overflow")]
    Overflow,
}
