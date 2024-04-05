import type { NextApiRequest, NextApiResponse } from "next";
import { connect } from "../../../utils/db";
import { handleWebhook } from "../../../services/webhook";
import { errorResponse } from "../../../utils/response";
import { CommonApiResponse } from "../../../types/general";

type Payload = undefined;

connect();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommonApiResponse<Payload> | null>
) {
  try {
    if (!req.method || req.method! !== "POST") {
      res.status(405).send(null);
      return;
    }

    req.log.info({ payload: req.body }, "Incoming Webhook Payload");
    await handleWebhook(req.body);

    res.status(200).json({ status: "ok", data: undefined });
  } catch (err) {
    errorResponse(req, res, err);
  }
}
