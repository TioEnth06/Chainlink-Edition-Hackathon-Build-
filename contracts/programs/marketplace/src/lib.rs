use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, TokenProgram, Transfer};

declare_id!("MarkXgE4PjqQzFjWBPPzQz7R8QzR8QzR8QzR8QzR8");

#[program]
pub mod marketplace {
    use super::*;

    pub fn list_product(
        ctx: Context<ListProduct>,
        product_id: String,
        price_lamports: u64,
        ip_owner: Pubkey,
    ) -> Result<()> {
        let listing = &mut ctx.accounts.listing;
        listing.seller = ctx.accounts.seller.key();
        listing.product_id = product_id;
        listing.price_lamports = price_lamports;
        listing.ip_owner = ip_owner;
        listing.bump = ctx.bumps.listing;
        Ok(())
    }

    pub fn buy(ctx: Context<Buy>) -> Result<()> {
        let listing = &ctx.accounts.listing;
        let buyer = &ctx.accounts.buyer;
        let payment = listing.price_lamports;

        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.buyer_ata.to_account_info(),
                to: ctx.accounts.seller_ata.to_account_info(),
                authority: buyer.to_account_info(),
            },
        );
        token::transfer(cpi_ctx, payment)?;
        Ok(())
    }
}

#[account]
pub struct Listing {
    pub seller: Pubkey,
    pub product_id: String,
    pub price_lamports: u64,
    pub ip_owner: Pubkey,
    pub bump: u8,
}

#[derive(Accounts)]
#[instruction(product_id: String)]
pub struct ListProduct<'info> {
    #[account(mut)]
    pub seller: Signer,

    #[account(
        init,
        payer = seller,
        space = 8 + 32 + (4 + 64) + 8 + 32 + 1,
        seeds = [b"listing", seller.key().as_ref(), product_id.as_bytes()],
        bump
    )]
    pub listing: Account<'info, Listing>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Buy<'info> {
    #[account(mut)]
    pub buyer: Signer,

    #[account(
        mut,
        close = seller,
        seeds = [b"listing", listing.seller.as_ref(), listing.product_id.as_bytes()],
        bump = listing.bump,
    )]
    pub listing: Account<'info, Listing>,

    #[account(mut)]
    pub seller: SystemAccount<'info>,
    #[account(mut)]
    pub buyer_ata: Account<'info, TokenAccount>,
    #[account(mut)]
    pub seller_ata: Account<'info, TokenAccount>,
    pub token_program: Program<'info, TokenProgram>,
}
