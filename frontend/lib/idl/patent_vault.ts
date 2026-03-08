/**
 * Patent Vault program IDL (matches contracts/programs/patent_vault).
 */
export const PATENT_VAULT_IDL = {
  version: "0.1.0",
  name: "patent_vault",
  instructions: [
    {
      name: "registerIp",
      accounts: [
        { name: "owner", isMut: true, isSigner: true },
        { name: "patentVault", isMut: true, isSigner: false },
        { name: "mint", isMut: true, isSigner: false },
        { name: "ownerTokenAccount", isMut: true, isSigner: false },
        { name: "tokenProgram", isMut: false, isSigner: false },
        { name: "systemProgram", isMut: false, isSigner: false },
        { name: "associatedTokenProgram", isMut: false, isSigner: false },
      ],
      args: [
        { name: "patentId", type: "string" },
        { name: "jurisdiction", type: "string" },
        { name: "documentHash", type: { array: ["u8", 32] } },
        { name: "valuationLamports", type: "u64" },
      ],
    },
  ],
  accounts: [
    {
      name: "patentVault",
      type: {
        kind: "struct",
        fields: [
          { name: "owner", type: "publicKey" },
          { name: "patentId", type: "string" },
          { name: "jurisdiction", type: "string" },
          { name: "documentHash", type: { array: ["u8", 32] } },
          { name: "valuationLamports", type: "u64" },
          { name: "bump", type: "u8" },
          { name: "mint", type: "publicKey" },
        ],
      },
    },
  ],
  errors: [],
} as const;
