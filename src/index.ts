import * as dotenv from "dotenv";
dotenv.config();
import { v4 as uuid } from "uuid";
import { parcelClient } from "./utils/parcel";
import { generateMnemonic } from "bip39";
import { Wallet } from "ethers";

(async () => {
  const mnemonic = await generateMnemonic();
  const wallet = Wallet.fromMnemonic(mnemonic);
  const address = wallet.address;
  const privateKey = wallet.privateKey;
  await parcelClient.createDatabase({
    shouldCreateUsers: true,
  });
  await parcelClient.insertUser({
    id: uuid(),
    privateKey,
    publicKey: address,
  });
})();
