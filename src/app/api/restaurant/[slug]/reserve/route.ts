import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma.utils";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  //getting all data from url
  const { slug } = params;
  const { searchParams } = new URL(request.url);
  const day = searchParams.get("day");
  const time = searchParams.get("time");
  const partySize = searchParams.get("partySize");

  //console.log(slug, partySize, day, time);

  //checking for params and slug
  if (!slug || !day || !partySize || !time) {
    return NextResponse.json(
      { errorMessage: "Invalid data provided." },
      { status: 400 }
    );
  }

  //Validation of data
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
  });

  if (!restaurant) {
    return NextResponse.json(
      { errorMessage: "Invalid data provided." },
      { status: 400 }
    );
  }

  if (
    new Date(`${day}T${time}`) < new Date(`${day}T${restaurant.open_time}`) ||
    new Date(`${day}T${time}`) > new Date(`${day}T${restaurant.close_time}`)
  ) {
    return NextResponse.json(
      { errorMessage: "Restaurnt is not open at this time." },
      { status: 400 }
    );
  }

  return NextResponse.json(
    {
      restaurant,
    },
    { status: 200 }
  );
}
//http://localhost:3000/api/restaurant/vivaan-fine-indian-cuisine-ottawa/availability?day=2023-01-01&time=20:00:00.000Z&partySize=2
