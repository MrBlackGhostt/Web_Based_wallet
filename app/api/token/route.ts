import type { NextApiRequest, NextApiResponse } from "next";
import { REACT_LOADABLE_MANIFEST } from "next/dist/shared/lib/constants";

type ResponseData = {
  message: string;
};

export default async function POST(req: Request, res: NextApiResponse) {
  const body = await req.json();
  const key = body.key;

  // Process as needed...
  res.status(200).json({ message: "Received key", key });

  res.setHeader("Allow", ["POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
