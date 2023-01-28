import { ImageResponse } from "@vercel/og";
import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  runtime: "experimental-edge",
};

const og = (req: NextApiRequest, res: NextApiResponse) => {
  // Get query params from request url
  if (!req.url) {
    return res.status(400).json({ error: "An url is required" });
  }
  const url = new URL(req.url, "http://localhost:3000");
  const name = url.searchParams.get("username");
  const title = url.searchParams.get("title");
  const imgSrc = url.searchParams.get("imgSrc");

  if (!name || !imgSrc) {
    return res
      .status(400)
      .json({ error: "Username and Image source are required" });
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
  return new ImageResponse(
    (
      <div
        style={{ fontFamily: "sans-serif" }}
        tw="relative w-[30rem] h-[15rem] flex flex-col p-10"
      >
        <div tw="flex flex-row">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Card"
            src={imgSrc}
            tw="w-20 h-20 rounded-full shadow-2xl mb-4 mr-6"
            style={{ objectPosition: "center", objectFit: "cover" }}
          />
          <div tw="flex flex-col ml-4">
            <h1 tw="text-3xl font-bold -mb-2 text-white">{name}</h1>
            <h2 tw="text-xl font-medium text-white">{title}</h2>
          </div>
        </div>
      </div>
    ),
    {
      width: 480,
      height: 240,

      // do not cache image
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
};

export default og;
