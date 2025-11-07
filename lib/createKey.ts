import * as ed from "@noble/ed25519";
import bs58 from "bs58";
// Dependency for the Mnemonic
import * as bip39 from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";

import { Keypair } from "@solana/web3.js";

function toHexString(arr: number[]) {
  const byteArray: string[] = [];
  arr.map((a) => {
    byteArray.push(a.toString(16).padStart(2, "0"));
  });
  return byteArray.join("");
}

async function createKey() {
  // Generate a secure random private key
  const { secretKey, publicKey } = await ed.keygenAsync();

  // Convert the message "hello world" to a Uint8Array
  const message = new TextEncoder().encode("hello world");

  // Generate the public key from the private key
  //   const pubKey = await ed.getPublicKeyAsync(privKey);

  // Sign the message

  // Verify the signature
  //   const isValid = await ed.verifyAsync(signature, message, publicKey);

  // Output the result
  //   console.log(isValid); // Should print `true` if the signature is valid
  return {
    privateKey: bs58.encode(secretKey),
    publicKey: bs58.encode(publicKey),
  };
}

const signMessage = async (message: string, secretKey: string) => {
  const uInt8UserMessage = new TextEncoder().encode(message);
  const key = bs58.decode(secretKey);
  const signature = await ed.signAsync(uInt8UserMessage, key);
  return bs58.encode(signature);
};

const verifyMessage = async (
  signature: string,
  message: string,
  key: string
) => {
  const byteSignature = bs58.decode(signature);
  const byteMessage = new TextEncoder().encode(message);
  const byteKey = bs58.decode(key);
  const isValid = await ed.verifyAsync(byteSignature, byteMessage, byteKey);
  return isValid;
};

const createMnemonic = () => {
  const mn = bip39.generateMnemonic(wordlist);
  return mn;
};

const createByteMnemonic = (mn: string) => {
  const ent = bip39.mnemonicToEntropy(mn, wordlist);
  return ent;
};

const createSeed = async (mn: string) => {
  const seed = await bip39.mnemonicToSeedWebcrypto(mn, "password");
  console.log("🚀 ----------------------------🚀");
  console.log("🚀 ~ createSeed ~ seed:", seed);
  console.log("🚀 ----------------------------🚀");
  return seed;
};

const createKeyPairSolana = (seed: Uint8Array) => {
  const key = Keypair.fromSeed(seed.slice(32));

  return key;
};

export {
  createKey,
  signMessage,
  verifyMessage,
  createMnemonic,
  createByteMnemonic,
  createSeed,
  createKeyPairSolana,
};
