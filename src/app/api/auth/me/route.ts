import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";

import prisma from "@/utils/prisma.utils";

export async function GET(request: NextRequest) {
  const headersList = headers();

  //Checking for JWT Token
  const bearerToken = headersList.get("authorization") as string;
  const token = bearerToken.split(" ")[1];

  //Decoding JWT - email/exp date
  const payload = jwt.decode(token) as { email: string };
  if (!payload.email) {
    return NextResponse.json(
      { errorMessage: "Unauthorized request." },
      { status: 401 }
    );
  }

  //Getting data from prisma
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      city: true,
      phone: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      { errorMessage: "User not found." },
      { status: 401 }
    );
  }

  return NextResponse.json(
    {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      phone: user.phone,
      city: user.city,
    },
    { status: 200 }
  );
}
