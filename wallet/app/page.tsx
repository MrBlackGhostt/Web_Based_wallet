"use client";
import { Button } from "@/components/ui/button";
import {
  createKey,
  createKeyPairSolana,
  createMnemonic,
  createSeed,
  signMessage,
  verifyMessage,
} from "@/lib/createKey";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Key, MessageSquare, CheckCircle } from "lucide-react"; // Assuming lucide-react is installed for icons

import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import { PublicKey } from "@solana/web3.js";
import { createAccount } from "@/lib/createAccount";

interface keys {
  secretKey: string;
  publicKey: string;
}

export default function Home() {
  const [objKeys, setObjKeys] = useState<keys[]>([]);

  const [publicKeys, setPublicKeys] = useState<PublicKey[]>([]);
  const [userMessage, setMessage] = useState<string>("");
  const [userSign, setSign] = useState<string>("");
  const [verifySign, setVerifySign] = useState<boolean>();

  const [mnemonicText, setMnemonicText] = useState<string[]>();

  const [seed, setSeed] = useState<Uint8Array>();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 flex justify-center items-center w-full min-h-screen p-6">
      <div className="flex flex-col justify-between gap-6 items-center w-full max-w-4xl bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-slate-700/50">
        <div className="flex flex-col md:flex-row justify-between items-center w-full mb-6">
          <h1 className="text-4xl font-bold text-white mb-4 md:mb-0">
            Create Your Wallet
          </h1>
          <Button
            className="whitespace-nowrap bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            onClick={async () => {
              const mn = createMnemonic();
              console.log(mn.split(" "));
              setMnemonicText(mn.split(" "));

              const seed = await createSeed(mn);
              setSeed(seed);

              const keys = createKeyPairSolana(seed);
              console.log("🚀 ----------------------🚀");
              console.log("🚀 ~ Home ~ keys:", keys);
              console.log("🚀 ----------------------🚀");
            }}>
            {/* <Text className="w-4 h-4 mr-2" /> */}
            Generate Phrase
          </Button>

          <Button
            className="whitespace-nowrap bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            onClick={async () => {
              const path = `m/44'/501'/${currentIndex}'/0'`;
              if (seed) {
                const derivedSeed = derivePath(path, seed?.toString("hex")).key; // What this aderivedPath do
                const secret =
                  nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
                const keypair = Keypair.fromSecretKey(secret);

                console.log("KEyPAIR", keypair);

                setPublicKeys([...publicKeys, keypair.publicKey]);
                setCurrentIndex(currentIndex + 1);
                // setObjKeys((prev) => [...prev, { keypair.privateKey, publicKey }]);
              }
            }}
            disabled={mnemonicText ? false : true}>
            <Key className="w-4 h-4 mr-2" />
            Create Wallet
          </Button>
          {/* <Button onClick={() => createAccount()}>Send Transaction</Button> */}
        </div>

        {mnemonicText && (
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-600 w-full mx-auto">
            <div className="grid grid-cols-3 gap-3">
              {mnemonicText?.map((word, i) => (
                <div
                  key={i}
                  className="bg-slate-700 text-slate-200 text-center rounded-md py-2 px-3 text-sm font-mono select-text shadow-sm">
                  {word}
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Show the keys */}
        <div className="bg-slate-800/50 w-full rounded-lg p-6 max-h-96 overflow-y-auto shadow-inner border border-slate-600">
          {publicKeys.length === 0 && (
            <p className="text-slate-300 text-center italic">
              No wallets created yet. Click `Create Wallet` to generate your
              first one.
            </p>
          )}
          <div className="space-y-4">
            {publicKeys.map((key, i: number) => (
              <Card
                className="bg-slate-700/80 border-slate-600 hover:bg-slate-700 transition-colors"
                key={i}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <Key className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        Wallet {i + 1}
                      </h3>
                      <p className="text-sm text-slate-400 truncate max-w-xs">
                        {key.toBase58()}
                      </p>
                    </div>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-500 text-slate-300 hover:bg-slate-600"
                        onClick={async () => {
                          const response = await fetch("/api/token", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ key: key.toBase58() }),
                          });
                          const data = await response.json();
                          console.log("Response from API:", data);
                        }}>
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Details
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-96 bg-slate-800 border-slate-600 p-0">
                      <Card
                        className={`bg-slate-800 border-0 shadow-none ${
                          verifySign ? "bg-green-700" : ""
                        }`}>
                        <CardHeader className="pb-4 border-b border-slate-700">
                          <CardTitle className="text-white flex items-center">
                            <Key className="w-5 h-5 mr-2" />
                            Wallet {i + 1} Details
                          </CardTitle>
                          <CardDescription className="text-slate-400">
                            Sign and verify messages using this `wallet's` keys.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className={`pt-6 space-y-4 `}>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">
                              Enter Message
                            </label>
                            <Textarea
                              onChange={(e) => setMessage(e.target.value)}
                              placeholder="Type your message here to sign..."
                              className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                              rows={3}
                            />
                          </div>
                          {/* <Button
                            className="w-full bg-green-600 hover:bg-green-700"
                            onClick={async () => {
                              const sign = await signMessage(
                                userMessage,
                                key.privateKey
                              );
                              console.log(sign);
                              setSign(sign);
                            }}>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Sign Message
                          </Button> */}
                          {userSign && (
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-slate-300">
                                Signature
                              </label>
                              <div className="bg-slate-700 p-3 rounded-md border border-slate-600">
                                <code className="text-xs text-slate-300 break-all">
                                  {userSign}
                                </code>
                              </div>
                            </div>
                          )}
                          <Button
                            variant="outline"
                            className="w-full border-slate-500 text-slate-300 hover:bg-slate-700"
                            onClick={async () => {
                              const sign = await verifyMessage(
                                userSign,
                                userMessage,
                                key.toBase58()
                              );
                              console.log(sign);
                              setVerifySign(sign);
                              alert(`Signature is Verify:- ${verifySign}`);
                            }}>
                            Verify Message
                          </Button>
                        </CardContent>
                      </Card>
                    </PopoverContent>
                  </Popover>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-slate-300 hover:text-white"
                    onClick={() =>
                      navigator.clipboard.writeText(key.toBase58())
                    }>
                    <Copy className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
