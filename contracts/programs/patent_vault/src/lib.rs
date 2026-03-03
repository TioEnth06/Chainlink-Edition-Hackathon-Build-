use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{Mint, Token, TokenAccount, TokenProgram};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod patent_vault {
    use super::*;

    /// Register IP and mint Patent NFT (supply 1) to owner.
    pub fn register_ip(
        ctx: Context<RegisterIp>,
        patent_id: String,
        jurisdiction: String,
        document_hash: [u8; 32],
        valuation_lamports: u64,
    ) -> Result<()> {
        let vault = &mut ctx.accounts.patent_vault;
        vault.owner = ctx.accounts.owner.key();
        vault.patent_id = patent_id.clone();
        vault.jurisdiction = jurisdiction;
        vault.document_hash = document_hash;
        vault.valuation_lamports = valuation_lamports;
        vault.bump = ctx.bumps.patent_vault;
        vault.mint = ctx.accounts.mint.key();

        let seeds = &[
            b"patent_vault",
            ctx.accounts.owner.key().as_ref(),
            patent_id.as_bytes(),
            &[ctx.bumps.patent_vault],
        ];
        let signer = &[&seeds[..]];
        anchor_spl::token::mint_to(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                anchor_spl::token::MintTo {
                    mint: ctx.accounts.mint.to_account_info(),
                    to: ctx.accounts.owner_token_account.to_account_info(),
                    authority: ctx.accounts.patent_vault.to_account_info(),
                },
                signer,
            ),
            1,
        )?;
        Ok(())
    }
}

#[account]
pub struct PatentVault {
    pub owner: Pubkey,
    pub patent_id: String,
    pub jurisdiction: String,
    pub document_hash: [u8; 32],
    pub valuation_lamports: u64,
    pub bump: u8,
    pub mint: Pubkey,
}

#[derive(Accounts)]
#[instruction(patent_id: String)]
pub struct RegisterIp<'info> {
    #[account(mut)]
    pub owner: Signer,

    #[account(
        init,
        payer = owner,
        space = 8 + 32 + (4 + 64) + (4 + 32) + 32 + 8 + 1 + 32,
        seeds = [b"patent_vault", owner.key().as_ref(), patent_id.as_bytes()],
        bump
    )]
    pub patent_vault: Account<'info, PatentVault>,

    #[account(
        init,
        payer = owner,
        mint::decimals = 0,
        mint::authority = patent_vault,
    )]
    pub mint: Account<'info, Mint>,

    #[account(
        init,
        payer = owner,
        associated_token::mint = mint,
        associated_token::authority = owner,
    )]
    pub owner_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, TokenProgram>,
    pub system_program: Program<'info, System>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}
