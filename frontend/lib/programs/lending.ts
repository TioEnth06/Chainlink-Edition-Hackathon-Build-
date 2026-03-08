"use client";

import { Program, AnchorProvider } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import { LENDING_IDL } from "@/lib/idl/lending";

const PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_LENDING_PROGRAM_ID ?? "7UPmL6f2GH1B7gQA859eUjSz9bjXffFahwPj86YhPyP1"
);

export function getLendingProgramId(): PublicKey {
  return PROGRAM_ID;
}

export function getLendingProgram(
  connection: Connection,
  wallet?: { publicKey: PublicKey }
): Program {
  const provider = new AnchorProvider(
    connection,
    wallet ?? ({ publicKey: PublicKey.default } as any),
    { commitment: "confirmed" }
  );
  return new Program(LENDING_IDL as any, PROGRAM_ID, provider);
}

export function derivePoolPda(programId: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([Buffer.from("pool")], programId);
}

export function derivePositionPda(programId: PublicKey, borrower: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("position"), borrower.toBuffer()],
    programId
  );
}
