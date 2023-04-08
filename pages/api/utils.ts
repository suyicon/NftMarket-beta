import { withIronSession } from "next-iron-session";
import contract from "../../public/contracts/NftMarket.json";

export const contractAddress = contract["networks"]["5777"]["address"];
export const pinataApiKey = process.env.PINATA_API_KEY as string;
export const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY as string;

export function withSession(handler: any) {
  return withIronSession(handler, {
    password: process.env.SECRET_COOKIE_PASSWORD as string,
    cookieName: "nft-auth-session",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production" ? true : false,
    },
  });
}