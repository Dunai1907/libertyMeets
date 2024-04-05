import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { changeLocation } from "../../../services/users";
import { CommonApiResponse } from "../../../types/general";
import { connect } from "../../../utils/db";
import { HttpError } from "../../../utils/HttpError";
import { errorResponse } from "../../../utils/response";

type Payload = {
  message: string;
};

type BodyType = {
  location: [lat: number, lng: number];
};

connect();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommonApiResponse<Payload>>
) {
  try {
    if (!req.method || req.method! !== "POST") {
      res.status(405);
      return;
    }

    console.log(req.body);

    req.log.debug({ body: req.body }, "Request.body");

    const { location } = req.body as BodyType;

    const session = await getSession({ req });

    if (!session?.user) {
      throw new HttpError(400, "user not valid");
    }

    await changeLocation(session.user.id as number, location[0], location[1]);

    res
      .status(200)
      .json({ status: "ok", data: { message: "success update location" } });
  } catch (err) {
    errorResponse(req, res, err);
  }
}
