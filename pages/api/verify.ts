import {v4 as uuidv4 } from "uuid";
import { Session } from "next-iron-session";
import { NextApiRequest,NextApiResponse } from "next";
import { withSession,contractAddress, pinataApiKey, pinataSecretApiKey } from "./utils";
import { NftMeta } from "@_types/nft";
import axios from "axios";



const handlePostRequest = async (req: NextApiRequest & { session: Session; }, res: NextApiResponse) => {
  const { body } = req;
  const nft = body.nft as NftMeta;

  if (!nft.name || !nft.description || !nft.image) {
    return res.status(422).send({ message: "Some of the form data are missing!" });
  }

  const jsonRes = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    pinataMetadata: {
      name: uuidv4()
    },
    pinataContent: nft
  }, {
    headers: {
      pinata_api_key: pinataApiKey,
      pinata_secret_api_key: pinataSecretApiKey
    }
  });

  return res.status(200).send(jsonRes.data);
};

const handleGetRequest = async (req: NextApiRequest & { session: Session; }, res: NextApiResponse) => {
  try {
    const message = { contractAddress, id: uuidv4() };
    req.session.set("message-session", message);
    await req.session.save();
    console.log(req.session.get("message-session"));
    return res.json(message);
  } catch (error) {
    console.log(error);
    return res.status(422).send({ message: "Cannot generate a message" });
  }
};

export default withSession(async (req: NextApiRequest & { session: Session }, res: NextApiResponse) => {
  switch (req.method) {
    case "POST":
      await handlePostRequest(req, res);
      break;
    case "GET":
      await handleGetRequest(req, res);
      break;
    default:
      res.status(200).json({ message: "Invalid API route" });
  }
});