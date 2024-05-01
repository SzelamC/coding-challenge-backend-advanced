import { randomBytes } from "crypto";
import { AirdropJobDetail, AirdropJobStore } from "./airdropJob";

describe("airdrop store unit test", () => {
  let airdropJobStore: AirdropJobStore;

  beforeEach(() => {
    airdropJobStore = new AirdropJobStore();
  });

  it("successfully store airdrop job", () => {
    const contractAddress = randomBytes(32).toString("hex");
    const redeemCode = airdropJobStore.generateRedeemCode();
    const airdropJob = airdropJobStore.generateAirdropJobDetails(
      redeemCode,
      contractAddress,
    );
    airdropJobStore.storeAirdropJobDetail(airdropJob);
    const airdropJobDetails = airdropJobStore.retrieveAllAirdrop();
    expect(airdropJobDetails).toContain(airdropJob);
  });

  it("successfully store multiple airdrop jobs", () => {
    const expected: AirdropJobDetail[] = [];
    for (let i = 0; i < 10; i++) {
      const contractAddress = randomBytes(32).toString("hex");
      const redeemCode = airdropJobStore.generateRedeemCode();
      const airdropJob = airdropJobStore.generateAirdropJobDetails(
        redeemCode,
        contractAddress,
      );
      airdropJobStore.storeAirdropJobDetail(airdropJob);
      expected.push(airdropJob);
    }
    const airdropJobDetails = airdropJobStore.retrieveAllAirdrop();
    expect(airdropJobDetails.length).toEqual(10);
    expect(airdropJobDetails).toEqual(expect.arrayContaining(expected));
  });

  it("successfully redeem airdrop job", () => {
    const contractAddress = randomBytes(32).toString("hex");
    const redeemCode = airdropJobStore.generateRedeemCode();
    const airdropJob = airdropJobStore.generateAirdropJobDetails(
      redeemCode,
      contractAddress,
    );
    airdropJobStore.storeAirdropJobDetail(airdropJob);
    airdropJobStore.redeemAirdropJob(redeemCode);
    expect(airdropJobStore.retrieveAirdropJob(redeemCode).redeemed).toEqual(
      true,
    );
  });

  it("successfully retrieve airdrop job", () => {
    const contractAddress = randomBytes(32).toString("hex");
    const redeemCode = airdropJobStore.generateRedeemCode();
    const airdropJob = airdropJobStore.generateAirdropJobDetails(
      redeemCode,
      contractAddress,
    );
    airdropJobStore.storeAirdropJobDetail(airdropJob);
    expect(airdropJobStore.retrieveAirdropJob(redeemCode)).toEqual(airdropJob);
  });
    
  it("retrieve non exist airdrop job", () => {
    const contractAddress = randomBytes(32).toString("hex");
    const redeemCode = airdropJobStore.generateRedeemCode();
    const airdropJob = airdropJobStore.generateAirdropJobDetails(
      redeemCode,
      contractAddress,
    );
        
    const fakeRedeemCode = airdropJobStore.generateRedeemCode();
    airdropJobStore.storeAirdropJobDetail(airdropJob);
    expect(() => airdropJobStore.retrieveAirdropJob(fakeRedeemCode)).toThrow()
  });

  it("incorrect redeem code", () => {
    const contractAddress = randomBytes(32).toString("hex");
    const redeemCode = airdropJobStore.generateRedeemCode();
    const airdropJob = airdropJobStore.generateAirdropJobDetails(
      redeemCode,
      contractAddress,
    );
    airdropJobStore.storeAirdropJobDetail(airdropJob);
    expect(() => {
      airdropJobStore.redeemAirdropJob("");
    }).toThrow();
  });

  it("airdrop job already redeem", () => {
    const contractAddress = randomBytes(32).toString("hex");
    const redeemCode = airdropJobStore.generateRedeemCode();
    const airdropJob = airdropJobStore.generateAirdropJobDetails(
      redeemCode,
      contractAddress,
    );
    airdropJobStore.storeAirdropJobDetail(airdropJob);

    airdropJobStore.redeemAirdropJob(redeemCode);
    expect(() => {
      airdropJobStore.redeemAirdropJob(redeemCode);
    }).toThrow();
  });
});
