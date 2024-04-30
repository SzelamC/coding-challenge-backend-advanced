export type BaseResponse<T> = {
  statusCode: number;
  message: string;
  data?: T;
};

export type GenerateRedeemCodeRequestBody = {
  nftContractAddress: string;
  quantity: number;
};

export type RedeemNFTRequestBody = {
  redeemCode: string;
  walletAddress: string;
};
