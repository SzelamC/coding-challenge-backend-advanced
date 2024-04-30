import { NextFunction, Request, Response, Router } from "express";
import { BaseResponse } from "../types";
import { AirdropJobDetail, airdropJobStore } from "../models/airdropJob";

const airdropJobRouter = Router();

// airdropJobRouter.use(timeLog);

airdropJobRouter.get(
  "/",
  (_: Request, res: Response<BaseResponse<AirdropJobDetail[]>>) => {
    res.status(200).send({
      message: "Successfully get all airdrop job details",
      statusCode: 200,
      data: airdropJobStore.retrieveAllAirdrop(),
    });
  },
);

airdropJobRouter.get(
  "/:id",
  (
    req: Request<{ id: string }>,
    res: Response<BaseResponse<AirdropJobDetail>>,
  ) => {
    const { id } = req.params;
    try {
      const airdropJob = airdropJobStore.retrieveAirdropJob(id);
      res.status(200).send({
        message: `Successfully get airdrop job detail for id: ${id}`,
        statusCode: 200,
        data: airdropJob,
      });
    } catch (err) {
      res.status(404).send({
        message: `Failed to get airdrop job detail for id: ${id}`,
        statusCode: 404,
      });
    }
  },
);

airdropJobRouter.put(
  "/:id",
  (
    req: Request<{ id: string }, {}, Partial<AirdropJobDetail>>,
    res: Response<BaseResponse<AirdropJobDetail>>,
  ) => {
    // TODO: Valid uuid v4
    const { id } = req.params;
    const { redeemed, redeemCode, contractAddress } = req.body;
    if (typeof redeemed !== "boolean") {
      res.status(404).send({
        message: "Invalid input",
        statusCode: 404,
      });
      return;
    }

    // INFO: 32 Bytes hex string length 64
    if (redeemCode && redeemCode.length !== 64) {
      res.status(404).send({
        message: "Invalid address or redeem code",
        statusCode: 404,
      });
      return;
    }

    // TODO: Valid contract address

    try {
      const updatedAirdropJob = airdropJobStore.updateAirdropJob(id, req.body);
      res.status(200).send({
        message: `Successfully update airdrop job detail for id: ${id}`,
        statusCode: 200,
        data: updatedAirdropJob,
      });
    } catch (err) {
      res.status(404).send({
        message: `Failed to update airdrop job detail for id: ${id}`,
        statusCode: 404,
      });
    }
  },
);

airdropJobRouter.delete("/:id", (req, res) => {
  // TODO: Valid uuid v4
  const { id } = req.params;
  try {
    airdropJobStore.deleteAirdropJob(id);
    res.status(200).send({
      message: `Successfully delete airdrop job detail for id: ${id}`,
      statusCode: 200,
    });
  } catch (err) {
    res.status(400).send({
      message: `Failed to delete airdrop job detail for id: ${id}`,
      statusCode: 400,
    });
  }
});

export default airdropJobRouter;
