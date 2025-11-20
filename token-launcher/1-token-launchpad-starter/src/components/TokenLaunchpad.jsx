import { MINT_SIZE, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { createInitializeMint2Instruction } from "@solana/spl-token";
import { getMinimumBalanceForRentExemptMint } from "@solana/spl-token";
import { Transaction, SystemProgram, Keypair } from "@solana/web3.js";
import { useState } from "react";
// import './TokenLaunchpad.css'; // Make sure to import the CSS file

export function TokenLaunchpad() {
  const { connection } = useConnection();
  const wallet = useWallet();

  // UI State (for inputs)
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [supply, setSupply] = useState("");

  const createToken = async () => {
    // --- YOUR LOGIC UNCHANGED START ---
    const feePayer = wallet.publicKey;
    const mintKeyPair = Keypair.generate();
    const lamports = await getMinimumBalanceForRentExemptMint(connection);

    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: feePayer,
        newAccountPubkey: mintKeyPair.publicKey,
        space: MINT_SIZE,
        lamports,
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeMint2Instruction(
        mintKeyPair.publicKey,
        9,
        feePayer,
        feePayer
      )
    );
    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;

    const partialSign = transaction.partialSign(mintKeyPair);
    console.log("PARTIALSIGN", partialSign);

    await wallet.signTransaction(transaction, connection);
    console.log("TOken mint publicKey", mintKeyPair.publicKey.toBase58());
    // --- YOUR LOGIC UNCHANGED END ---
  };

  return (
    <div className="launchpad-container">
      <div className="launchpad-card">
        <div className="launchpad-header">
          <h1>Solana Token Launchpad</h1>
          <p className="subtext">Launch your custom token on Solana Devnet</p>
        </div>

        <div className="input-group">
          <label htmlFor="name">Name</label>
          <input
            className="input-field"
            type="text"
            placeholder="e.g. Solana Gold"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="symbol">Symbol</label>
          <input
            className="input-field"
            type="text"
            placeholder="e.g. SOLD"
            id="symbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="url">Image URL</label>
          <input
            className="input-field"
            type="text"
            placeholder="https://..."
            id="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="supply">Initial Supply</label>
          <input
            className="input-field"
            type="number"
            placeholder="e.g. 1000000"
            id="supply"
            value={supply}
            onChange={(e) => setSupply(e.target.value)}
          />
        </div>

        <button onClick={createToken} className="btn-launch">
          ROCKET LAUNCH 🚀
        </button>
      </div>
    </div>
  );
}
