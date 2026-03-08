"use client";

import { Program, AnchorProvider } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import { PATENT_VAULT_IDL } from "@/lib/idl/patent_vault";

const PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_PATENT_VAULT_PROGRAM_ID ??
    "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"
);

export function getPatentVaultProgramId(): PublicKey {
  return PROGRAM_ID;
}

export function getPatentVaultProgram(
  connection: Connection,
  wallet?: { publicKey: PublicKey }
): Program {
  const provider = new AnchorProvider(
    connection,
    wallet ?? ({ publicKey: PublicKey.default } as any),
    { commitment: "confirmed" }
  );
  return new Program(PATENT_VAULT_IDL as any, PROGRAM_ID, provider);
}

export function derivePatentVaultPda(
  programId: PublicKey,
  owner: PublicKey,
  patentId: string
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("patent_vault"), owner.toBuffer(), Buffer.from(patentId, "utf8")],
    programId
  );
}
