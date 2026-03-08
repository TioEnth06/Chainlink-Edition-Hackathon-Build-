/**
 * Lending program IDL (matches contracts/programs/lending).
 * Regenerate with `anchor build` when build env supports it.
 */
export const LENDING_IDL = {
  version: "0.1.0",
  name: "lending",
  instructions: [
    {
      name: "initializePool",
      accounts: [
        { name: "authority", isMut: true, isSigner: true },
        { name: "pool", isMut: true, isSigner: false },
        { name: "stableMint", isMut: false, isSigner: false },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [{ name: "liquidationLtvBps", type: "u16" }],
    },
    {
      name: "depositCollateral",
      accounts: [
        { name: "borrower", isMut: true, isSigner: true },
        { name: "pool", isMut: true, isSigner: false },
        { name: "position", isMut: true, isSigner: false },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [
        { name: "patentVault", type: "publicKey" },
        { name: "collateralValuationLamports", type: "u64" },
      ],
    },
    {
      name: "borrow",
      accounts: [
        { name: "borrower", isMut: true, isSigner: true },
        { name: "pool", isMut: true, isSigner: false },
        { name: "position", isMut: true, isSigner: false },
        { name: "poolStableTreasury", isMut: true, isSigner: false },
        { name: "borrowerStableAta", isMut: true, isSigner: false },
        { name: "tokenProgram", isMut: false, isSigner: false },
      ],
      args: [{ name: "amount", type: "u64" }],
    },
    {
      name: "repay",
      accounts: [
        { name: "borrower", isMut: true, isSigner: true },
        { name: "pool", isMut: true, isSigner: false },
        { name: "position", isMut: true, isSigner: false },
        { name: "poolStableTreasury", isMut: true, isSigner: false },
        { name: "borrowerStableAta", isMut: true, isSigner: false },
        { name: "tokenProgram", isMut: false, isSigner: false },
      ],
      args: [{ name: "amount", type: "u64" }],
    },
    {
      name: "updateCollateralFromFeed",
      accounts: [
        { name: "chainlinkFeed", isMut: false, isSigner: false },
        { name: "position", isMut: true, isSigner: false },
      ],
      args: [],
    },
    {
      name: "executeLiquidation",
      accounts: [
        { name: "liquidator", isMut: false, isSigner: true },
        { name: "pool", isMut: false, isSigner: false },
        { name: "position", isMut: true, isSigner: false },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: "lendingPool",
      type: {
        kind: "struct",
        fields: [
          { name: "authority", type: "publicKey" },
          { name: "liquidationLtvBps", type: "u16" },
          { name: "bump", type: "u8" },
          { name: "stableMint", type: "publicKey" },
        ],
      },
    },
    {
      name: "loanPosition",
      type: {
        kind: "struct",
        fields: [
          { name: "borrower", type: "publicKey" },
          { name: "patentVault", type: "publicKey" },
          { name: "collateralValuationLamports", type: "u64" },
          { name: "debtLamports", type: "u64" },
          { name: "bump", type: "u8" },
          { name: "liquidatable", type: "bool" },
        ],
      },
    },
  ],
  errors: [
    { code: 6000, name: "LtvTooHigh", msg: "LTV exceeds maximum" },
    { code: 6001, name: "NotLiquidatable", msg: "Position not liquidatable" },
    { code: 6002, name: "ChainlinkReadError", msg: "Chainlink read error" },
    { code: 6003, name: "RoundDataMissing", msg: "No round data" },
    { code: 6004, name: "Overflow", msg: "Overflow" },
  ],
} as const;
