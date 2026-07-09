import type { NextApiRequest, NextApiResponse } from "next";
import { getSessionFromApiRequest } from "../../../src/lib/auth";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  const session = await getSessionFromApiRequest(request);

  if (!session) {
    response.status(401).json({ error: "Unauthorized" });
    return;
  }

  response.status(200).json({
    ok: true,
    session
  });
}
