import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query") || "";
  console.log(query);

  const products = await prisma.product.findMany({
    where: {
      OR: [
        {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          name: {
            contains: query.charAt(0).toUpperCase() + query.slice(1),
            mode: "insensitive",
          },
        },
      ],
    },
    take: 5,
  });

  return NextResponse.json(products);
}
