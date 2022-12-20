// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { signAccessJwt } from "livepeer/crypto";
import * as LitJsSdk from "@lit-protocol/lit-node-client";

const client = new LitJsSdk.LitNodeClient({ debug: false, alertWhenUnauthorized: false });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method Not Allowed", message: 'Only POST requests are allowed.' });
  const { playbackId, resourceId, authSig, accessControlConditions } = req.body;
  if (["playbackId", "resourceId", "authSig", "accessControlConditions"].some(key => !req.body[key])) return res.status(400).json({ error: "Bad Request", message: 'Missing required parameters.' });
  console.log("resourceId", resourceId);
  try {
    await client.connect();
    await client.getSignedToken({
      accessControlConditions,
      chain: "mumbai",
      authSig,
      resourceId
    });
    const token = await signAccessJwt({
      privateKey: process.env.NEXT_PUBLIC_LIVEPEER_SIGNING_PRIVATE_KEY,
      publicKey: process.env.NEXT_PUBLIC_LIVEPEER_SIGNING_PUBLIC_KEY,
      issuer: "Aptos",
      playbackId,
      expiration: "1hr",
    });
    return res.status(200).json({ token });
  } catch (error) {
    console.log(error.message, error);
    res.status(500).json({ error });
  }
}
