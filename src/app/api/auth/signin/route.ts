import { NextRequest, NextResponse } from "next/server";
import validator from "validator";
import bcrypt from "bcrypt";
import * as jose from "jose";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const errors: string[] = [];
  const { email, password } = await request.json();

  //validating inputs
  const validationSchema = [
    {
      valid: validator.isEmail(email),
      errorMessage: "Email is invalid",
    },
    {
      valid: validator.isLength(password, { min: 1 }),
      errorMessage: "Password is invalid",
    },
  ];

  validationSchema.forEach((check) => {
    if (!check.valid) {
      errors.push(check.errorMessage);
    }
  });

  if (errors.length) {
    return NextResponse.json({ errorMessage: errors[0] }, { status: 400 });
  }

  //Checking for account
  const userWithEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!userWithEmail) {
    return NextResponse.json(
      { errorMessage: "Email or password is invalid." },
      { status: 401 }
    );
  }

  //Checking password
  const isMatch = await bcrypt.hash(password, userWithEmail.password);
  if (!isMatch) {
    return NextResponse.json(
      { errorMessage: "Email or password is invalid." },
      { status: 401 }
    );
  }

  //JWT
  const alg = "HS256";
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const token = await new jose.SignJWT({ email: userWithEmail.email })
    .setProtectedHeader({ alg })
    .setExpirationTime("24h")
    .sign(secret);

  return NextResponse.json({ token: token }, { status: 200 });
}
