use anchor_lang::prelude::*;
use anchor_spl::token::{self, MintTo, Token, TokenAccount, TokenProgram};

declare_id!("StakXgE4PjqQzFjWBPPzQz7R8QzR8QzR8QzR8QzR8");

#[program]
pub mod staking {
    use super::*;

    pub fn initialize_pool(ctx: Context<InitializePool>, reward_rate_bps: u64) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        pool.authority = ctx.accounts.authority.key();
        pool.stake_mint = ctx.accounts.stake_mint.key();
        pool.reward_rate_bps = reward_rate_bps;
        pool.total_staked = 0;
        pool.bump = ctx.bumps.pool;
        Ok(())
    }

    pub fn stake(ctx: Context<Stake>, amount: u64) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        let stake_account = &mut ctx.accounts.stake_account;
        stake_account.staker = ctx.accounts.staker.key();
        stake_account.amount = stake_account.amount.saturating_add(amount);
        stake_account.last_stake_time = Clock::get()?.unix_timestamp;
        stake_account.bump = ctx.bumps.stake_account;
        pool.total_staked = pool.total_staked.saturating_add(amount);

        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.staker_ata.to_account_info(),
                to: ctx.accounts.pool_treasury.to_account_info(),
                authority: ctx.accounts.staker.to_account_info(),
            },
        );
        token::transfer(cpi_ctx, amount)?;
        Ok(())
    }

    pub fn unstake(ctx: Context<Unstake>, amount: u64) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        let stake_account = &mut ctx.accounts.stake_account;
        let amount_to_unstake = amount.min(stake_account.amount);
        stake_account.amount = stake_account.amount.saturating_sub(amount_to_unstake);
        pool.total_staked = pool.total_staked.saturating_sub(amount_to_unstake);

        let pool = &ctx.accounts.pool;
        let seeds = &[b"pool", &[pool.bump]];
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.pool_treasury.to_account_info(),
                to: ctx.accounts.staker_ata.to_account_info(),
                authority: ctx.accounts.pool.to_account_info(),
            },
            &[&seeds[..]],
        );
        token::transfer(cpi_ctx, amount_to_unstake)?;
        Ok(())
    }

    pub fn claim_rewards(ctx: Context<ClaimRewards>) -> Result<()> {
        let stake_account = &mut ctx.accounts.stake_account;
        let clock = Clock::get()?;
        let elapsed = (clock.unix_timestamp - stake_account.last_stake_time) as u64;
        let pool = &ctx.accounts.pool;
        let rewards = stake_account
            .amount
            .saturating_mul(elapsed)
            .saturating_mul(pool.reward_rate_bps)
            .saturating_div(10_000)
            .saturating_div(365 * 24 * 3600);
        stake_account.last_stake_time = clock.unix_timestamp;
        if rewards > 0 {
            let seeds = &[b"pool", &[pool.bump]];
            let cpi_ctx = CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                MintTo {
                    mint: ctx.accounts.reward_mint.to_account_info(),
                    to: ctx.accounts.staker_ata.to_account_info(),
                    authority: ctx.accounts.pool.to_account_info(),
                },
                &[&seeds[..]],
            );
            token::mint_to(cpi_ctx, rewards)?;
        }
        Ok(())
    }
}

#[account]
pub struct StakingPool {
    pub authority: Pubkey,
    pub stake_mint: Pubkey,
    pub reward_rate_bps: u64,
    pub total_staked: u64,
    pub bump: u8,
}

#[account]
pub struct StakeAccount {
    pub staker: Pubkey,
    pub amount: u64,
    pub last_stake_time: i64,
    pub bump: u8,
}

#[derive(Accounts)]
pub struct InitializePool<'info> {
    #[account(mut)]
    pub authority: Signer,

    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 32 + 8 + 8 + 1,
        seeds = [b"pool"],
        bump
    )]
    pub pool: Account<'info, StakingPool>,
    pub stake_mint: Account<'info, anchor_spl::token::Mint>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Stake<'info> {
    #[account(mut)]
    pub staker: Signer,

    #[account(
        mut,
        seeds = [b"pool"],
        bump = pool.bump,
    )]
    pub pool: Account<'info, StakingPool>,

    #[account(
        init_if_needed,
        payer = staker,
        space = 8 + 32 + 8 + 8 + 1,
        seeds = [b"stake", staker.key().as_ref()],
        bump
    )]
    pub stake_account: Account<'info, StakeAccount>,

    #[account(mut)]
    pub staker_ata: Account<'info, TokenAccount>,
    #[account(mut)]
    pub pool_treasury: Account<'info, TokenAccount>,
    pub token_program: Program<'info, TokenProgram>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Unstake<'info> {
    #[account(mut)]
    pub staker: Signer,

    #[account(
        mut,
        seeds = [b"pool"],
        bump = pool.bump,
    )]
    pub pool: Account<'info, StakingPool>,

    #[account(
        mut,
        seeds = [b"stake", staker.key().as_ref()],
        bump = stake_account.bump,
    )]
    pub stake_account: Account<'info, StakeAccount>,

    #[account(mut)]
    pub staker_ata: Account<'info, TokenAccount>,
    #[account(mut)]
    pub pool_treasury: Account<'info, TokenAccount>,
    pub token_program: Program<'info, TokenProgram>,
}

#[derive(Accounts)]
pub struct ClaimRewards<'info> {
    #[account(mut)]
    pub staker: Signer,

    #[account(
        mut,
        seeds = [b"pool"],
        bump = pool.bump,
    )]
    pub pool: Account<'info, StakingPool>,

    #[account(
        mut,
        seeds = [b"stake", staker.key().as_ref()],
        bump = stake_account.bump,
    )]
    pub stake_account: Account<'info, StakeAccount>,

    #[account(mut)]
    pub reward_mint: Account<'info, anchor_spl::token::Mint>,
    #[account(mut)]
    pub staker_ata: Account<'info, TokenAccount>,
    pub token_program: Program<'info, TokenProgram>,
}
