import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

export async function middleware(req: NextRequest, res: NextResponse) {
  //Checking for JWT Token
  const bearerToken = req.headers.get("authorization") as string;

  if (!bearerToken) {
    return NextResponse.json(
      { errorMessage: "Unauthorized request." },
      { status: 401 }
    );
  }

  const token = bearerToken.split(" ")[1];
  if (!token) {
    return NextResponse.json(
      { errorMessage: "Unauthorized request." },
      { status: 401 }
    );
  }

  //Veryfire Token
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  try {
    await jose.jwtVerify(token, secret);
  } catch (error) {
    return NextResponse.json(
      { errorMessage: "Unauthorized request." },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: ["/api/auth/me"],
};
