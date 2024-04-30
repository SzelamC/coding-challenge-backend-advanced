import { Request, Response } from "express";
import {
  BaseResponse,
  GenerateRedeemCodeRequestBody,
  RedeemNFTRequestBody,
} from "../types";
import { airdropJobStore } from "../models/airdropJob";

export const airdropNFT = async (
  contractAddress: string,
  recipient: string,
  quantity: number,
) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, 5000);
  });
};

export function generateRedeemCode(
  req: Request<{}, BaseResponse<string[]>, GenerateRedeemCodeRequestBody>,
  res: Response<BaseResponse<string[]>>,
) {
  const { nftContractAddress, quantity } = req.body;
  if (!nftContractAddress || quantity <= 0) {
    res.status(400).send({
      message: "Invalid input for generate redeem code",
      statusCode: 400,
    });
    return;
  }
  const redeemCodes: string[] = [];
  for (let i = 0; i < quantity; i++) {
    const redeemCode = airdropJobStore.generateRedeemCode();
    const airdropJob = airdropJobStore.generateAirdropJobDetails(
      redeemCode,
      nftContractAddress,
    );
    airdropJobStore.storeAirdropJobDetail(airdropJob);
    redeemCodes.push(redeemCode);
  }
  res.status(200).send({
    message: `Generate ${quantity} redeemCode for contract: ${nftContractAddress}`,
    statusCode: 200,
    data: redeemCodes,
  });
  return;
}

export function redeemNFT(
  req: Request<{}, BaseResponse<{}>, RedeemNFTRequestBody>,
  res: Response<BaseResponse<{}>>,
) {
  const { redeemCode, walletAddress } = req.body;
  if (!redeemCode || !walletAddress) {
    res.status(400).send({
      message: "Invalid input for redeem NFT",
      statusCode: 400,
    });
    return;
  }
  // TODO: interact with the corresponding with smart contract by wallet address, ignore for simplicity
  try {
    const _ = airdropJobStore.redeemAirdropJob(redeemCode);
    res.status(200).send({
      message: `Redeem NFT successfully, redeem code: ${redeemCode} revoke`,
      statusCode: 200,
    });
  } catch (err) {
    res.status(400).send({
      message: (err as Error).message,
      statusCode: 400,
    });
  }
}
