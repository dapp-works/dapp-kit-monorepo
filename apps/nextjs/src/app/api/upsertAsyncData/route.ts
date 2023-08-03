import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

type Data = {
  data: any;
  msg: string;
};

export async function POST(req: NextRequest, context: { params }, res: Response) {
  const { projectId, config } = await req.json();
  const authorization = req.headers.get("authorization")?.replace("Bearer ", "");
  console.log(authorization);
  if (!authorization) {
    return new NextResponse(JSON.stringify("Missing authorization header."), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  axios.defaults.headers.common["Authorization"] = ``;
  try {
    const response = await axios.post(
      `https://spoon.dapp.works/api/upsertAsyncData`,
      {
        projectId,
        config,
      },
      {
        headers: {
          Authorization: `Bearer ${authorization}`,
        },
      }
    );
    return new NextResponse(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error(error);
    return new NextResponse(JSON.stringify(error?.message), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
