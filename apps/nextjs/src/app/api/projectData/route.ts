import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

type Data = {
  config: string;
};

export async function GET(req: NextRequest, context: { params }, res: Response) {
  try {
    if (!process.env.NEXT_PUBLIC_PROJECT_ID) {
      return new NextResponse(JSON.stringify("Please set your project id in process.env.NEXT_PUBLIC_PROJECT_ID"), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
    const forceUpdate = req.nextUrl.searchParams.get("forceUpdate");
    console.log(forceUpdate);
    delete axios.defaults.headers.common["Authorization"];
    const response = await axios.get(`https://api.smartgraph.one/api/rest/test/${process.env.NEXT_PUBLIC_PROJECT_ID}`);
    if (forceUpdate) {
      return new NextResponse(JSON.stringify(response.data.project[0]?.config ?? {}), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new NextResponse(JSON.stringify(response.data.project[0]?.config ?? {}), {
      status: 200,
      headers: { "Content-Type": "application/json", "cache-control": "public, s-maxage=60, stale-while-revalidate=60" },
    });
  } catch (error: any) {
    console.error(error);
    return new NextResponse(JSON.stringify(error?.message), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
