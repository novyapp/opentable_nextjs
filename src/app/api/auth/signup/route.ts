import { NextRequest, NextResponse } from "next/server";
import validator from "validator";
import bcrypt from "bcrypt";
import * as jose from "jose";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const { firstName, lastName, email, city, phone, password } =
    await request.json();

  const errors: string[] = [];

  //validating inputs
  const validationSchema = [
    {
      valid: validator.isLength(firstName, { min: 1, max: 20 }),
      errorMessage: "First name is invalid",
    },
    {
      valid: validator.isLength(lastName, { min: 1, max: 20 }),
      errorMessage: "Last name is invalid",
    },
    {
      valid: validator.isEmail(email),
      errorMessage: "Email is invalid",
    },
    {
      valid: validator.isMobilePhone(phone),
      errorMessage: "Phone number is invalid",
    },
    {
      valid: validator.isLength(city, { min: 1 }),
      errorMessage: "City is invalid",
    },
    {
      valid: validator.isStrongPassword(password),
      errorMessage: "Password is not strong enough",
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
  if (userWithEmail) {
    return NextResponse.json(
      { errorMessage: "Email already used." },
      { status: 400 }
    );
  }

  //Hashing password
  const hashedPassword = await bcrypt.hash(password, 10);

  //Adding user to database
  const user = await prisma.user.create({
    data: {
      first_name: firstName,
      last_name: lastName,
      password: hashedPassword,
      city,
      phone,
      email,
    },
  });

  //JWT
  const alg = "HS256";
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const token = await new jose.SignJWT({ email: user.email })
    .setProtectedHeader({ alg })
    .setExpirationTime("24h")
    .sign(secret);

  return NextResponse.json({ token: token }, { status: 200 });
}