import type { NextApiRequest, NextApiResponse } from "next";
import { HttpError } from "./HttpError";

export function errorResponse(req: NextApiRequest, res: NextApiResponse, err: unknown) {
  req.log.error(err);

  const { message } = err as Error;
  const status = err instanceof HttpError
    ? (err as HttpError).httpCode
    : 500;
  res
    .status(status)
    .json({ status: "error", data: { message } });
}
