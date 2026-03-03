use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, TokenProgram, Transfer};

declare_id!("FundXgE4PjqQzFjWBPPzQz7R8QzR8QzR8QzR8QzR8");

#[program]
pub mod funding {
    use super::*;

    pub fn create_campaign(
        ctx: Context<CreateCampaign>,
        goal_lamports: u64,
        milestone_count: u8,
    ) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;
        campaign.creator = ctx.accounts.creator.key();
        campaign.goal_lamports = goal_lamports;
        campaign.raised_lamports = 0;
        campaign.milestone_count = milestone_count;
        campaign.current_milestone = 0;
        campaign.bump = ctx.bumps.campaign;
        Ok(())
    }

    pub fn contribute(ctx: Context<Contribute>, amount: u64) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;
        campaign.raised_lamports = campaign.raised_lamports.saturating_add(amount);

        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.contributor_ata.to_account_info(),
                to: ctx.accounts.campaign_treasury.to_account_info(),
                authority: ctx.accounts.contributor.to_account_info(),
            },
        );
        token::transfer(cpi_ctx, amount)?;
        Ok(())
    }

    pub fn release_milestone(ctx: Context<ReleaseMilestone>) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;
        require!(
            (campaign.current_milestone as u64) < campaign.milestone_count as u64,
            FundingError::NoMilestone
        );
        campaign.current_milestone = campaign.current_milestone.saturating_add(1);
        Ok(())
    }
}

#[account]
pub struct Campaign {
    pub creator: Pubkey,
    pub goal_lamports: u64,
    pub raised_lamports: u64,
    pub milestone_count: u8,
    pub current_milestone: u8,
    pub bump: u8,
}

#[derive(Accounts)]
pub struct CreateCampaign<'info> {
    #[account(mut)]
    pub creator: Signer,

    #[account(
        init,
        payer = creator,
        space = 8 + 32 + 8 + 8 + 1 + 1 + 1,
        seeds = [b"campaign", creator.key().as_ref()],
        bump
    )]
    pub campaign: Account<'info, Campaign>,

    /// Token account (created by creator) to hold campaign contributions
    #[account(mut)]
    pub campaign_treasury: Account<'info, TokenAccount>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Contribute<'info> {
    #[account(mut)]
    pub contributor: Signer,

    #[account(
        mut,
        seeds = [b"campaign", campaign.creator.as_ref()],
        bump = campaign.bump,
    )]
    pub campaign: Account<'info, Campaign>,

    #[account(mut)]
    pub contributor_ata: Account<'info, TokenAccount>,
    #[account(mut)]
    pub campaign_treasury: Account<'info, TokenAccount>,
    pub token_program: Program<'info, TokenProgram>,
}

#[derive(Accounts)]
pub struct ReleaseMilestone<'info> {
    pub authority: Signer,

    #[account(
        mut,
        seeds = [b"campaign", campaign.creator.as_ref()],
        bump = campaign.bump,
    )]
    pub campaign: Account<'info, Campaign>,
}

#[error_code]
pub enum FundingError {
    #[msg("No milestone to release")]
    NoMilestone,
}
