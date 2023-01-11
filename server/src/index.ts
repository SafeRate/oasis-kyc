import * as dotenv from "dotenv";
dotenv.config();
import express from "express";

import { v4 as uuid } from "uuid";
import { parcelClient } from "./utils/parcel";
import { generateMnemonic } from "bip39";
import { Wallet } from "ethers";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.json());

app.post("/create", async (req, res) => {
  const mnemonic = await generateMnemonic();
  const wallet = Wallet.fromMnemonic(mnemonic);
  const address = wallet.address;
  const privateKey = wallet.privateKey;

  console.log(`Public address for this is user is: ${address}`);

  await parcelClient.insertUser({
    id: uuid(),
    mnemonic,
    privateKey,
    publicKey: address,
  });

  res.json({
    address,
  });
});

const port = 8080;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
