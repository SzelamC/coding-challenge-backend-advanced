import { randomBytes, randomUUID } from "crypto";

export class AirdropJobDetail {
  public id: string;
  public redeemCode: string;
  public redeemed: boolean;
  public contractAddress: string;

  constructor(id: string, redeemCode: string, contractAddress: string) {
    this.id = id;
    this.redeemCode = redeemCode;
    this.contractAddress = contractAddress;
    this.redeemed = false;
  }
}

export class AirdropJobStore {
  // TODO: Implement the in-memory store logic
  private airdropJobDetails: AirdropJobDetail[];

  constructor() {
    this.airdropJobDetails = [];
  }

  public generateAirdropJobDetails(
    redeemCode: string,
    contractAddr: string,
  ): AirdropJobDetail {
    const id = randomUUID();
    return new AirdropJobDetail(id, redeemCode, contractAddr);
  }

  public storeAirdropJobDetail(airdropJobDetail: AirdropJobDetail): void {
    this.airdropJobDetails.push(airdropJobDetail);
  }

  public retrieveAllAirdrop(): AirdropJobDetail[] {
    return this.airdropJobDetails;
  }

  public retrieveAirdropJob(redeemCode: string): AirdropJobDetail {
    const targetAirdropJob = this.airdropJobDetails.find(
      (job) => job.redeemCode === redeemCode,
    );
    if (!targetAirdropJob) {
      throw new Error("Airdrop job not exist");
    }
    return targetAirdropJob;
  }

  public redeemAirdropJob(redeemCode: string): void {
    const targetAirdropJob = this.airdropJobDetails.find(
      (job) => job.redeemCode === redeemCode,
    );
    if (!targetAirdropJob) {
      throw new Error("Incorrect redeem code");
    }
    if (targetAirdropJob.redeemed) {
      throw new Error("NFT already redeemed");
    }
    targetAirdropJob.redeemed = true;
  }

  public updateAirdropJob(id: string, airdropJob: Partial<AirdropJobDetail>) {
    const targetAirdropJobIdx = this.airdropJobDetails.findIndex(
      (job) => job.id === id,
    );
    if (targetAirdropJobIdx === -1) {
      throw new Error("Airdrop job not exist");
    }
    this.airdropJobDetails[targetAirdropJobIdx] = {
      ...this.airdropJobDetails[targetAirdropJobIdx],
      ...airdropJob,
    };
    return this.airdropJobDetails[targetAirdropJobIdx];
  }

  public deleteAirdropJob(id: string) {
    const targetAirdropJobIdx = this.airdropJobDetails.findIndex(
      (job) => job.id === id,
    );
    if (targetAirdropJobIdx === -1) {
      throw new Error("Airdrop job not exist");
    }
    this.airdropJobDetails.splice(targetAirdropJobIdx, 1);
  }

  public generateRedeemCode(): string {
    return randomBytes(32).toString("hex");
  }
}

export const airdropJobStore = new AirdropJobStore();
