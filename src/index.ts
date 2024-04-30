import express, { Express, Request, Response } from "express";
import { generateRedeemCode, redeemNFT } from "./controllers/airdrop";
import airdropJobRouter from "./controllers/airdropDetails";
import { auth } from "./auth/authMiddleware";

const app: Express = express();
const port = process.env.PORT || "8888";

app.use(express.json());
app.use(auth);

app.get("/", (req: Request, res: Response) => {
  res.send("OK");
});

app.post("/generateRedeemCode", generateRedeemCode);
app.put("/redeem", redeemNFT);

app.use("/airdropJobs", airdropJobRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
