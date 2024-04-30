import { NextFunction, Request, Response } from "express";
import { BaseResponse } from "../types";

type User = {
  role: "admin" | "public";
  apiKey?: string;
};

export const users: User[] = [
  {
    role: "admin",
    apiKey: "ZA0sAcJFow6520eO5toToTl7zr9CabriYlsFxLAZ3eUslBPoG2dOS03yhpZpp6DE",
  },
  {
    role: "public",
    apiKey: "tFcUrAXV6fjKqeNdJUvhYk4cI8iqs1IWIuRlNEw4gR5xgjSvxfVTh3fVPPWp1rSh",
  },
];

export function auth(
  req: Request,
  res: Response<BaseResponse<{}>>,
  next: NextFunction,
) {
  const apiKey = req.headers.apikey;
  if (!apiKey) {
    res.status(403).send({
      message: "Unauthenticated",
      statusCode: 401,
    });
    return;
  }
  const user = users.find((u) => u.apiKey === apiKey);
  if (!user) {
    res.status(404).send({
      message: "User not found",
      statusCode: 404,
    });
    return;
  }
  if (req.path.startsWith("/airdropJobs")) {
    if (user.role === "public") {
      res.status(401).send({
        message: "Unauthorized",
        statusCode: 401,
      });
      return;
    } else {
      next();
    }
  } else {
    next();
  }
}
