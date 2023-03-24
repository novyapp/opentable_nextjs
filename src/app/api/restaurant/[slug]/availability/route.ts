import { NextRequest, NextResponse } from "next/server";
import { times } from "@/data";
import prisma from "@/utils/prisma.utils";
import { findAvailabileTables } from "@/services/restaurant/findAvailableTables";
import { Table } from "@prisma/client";

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
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
    select: {
      tables: true,
      open_time: true,
      close_time: true,
    },
  });

  if (!restaurant) {
    return NextResponse.json(
      { errorMessage: "Invalid data provided." },
      { status: 400 }
    );
  }

  const searchTimesWithTables = await findAvailabileTables({
    day,
    time,
    restaurant,
  });

  if (searchTimesWithTables instanceof Array) {
    const availabilities = searchTimesWithTables
      .map((t) => {
        const sumSeats = t.tables.reduce((sum, table) => {
          return sum + table.seats;
        }, 0);

        return {
          time: t.time,
          available: sumSeats >= parseInt(partySize),
        };
      })
      .filter((availability) => {
        const timeIsAfterOpeningHour =
          new Date(`${day}T${availability.time}`) >=
          new Date(`${day}T${restaurant.open_time}`);
        const timeIsBeforeClosingHour =
          new Date(`${day}T${availability.time}`) <=
          new Date(`${day}T${restaurant.close_time}`);

        return timeIsAfterOpeningHour && timeIsBeforeClosingHour;
      });

    return NextResponse.json(
      availabilities,
      //   searchTimes,
      //   bookings,
      //   bookingTableObj,
      //   tables,
      //   searchTimesWithTables,

      { status: 200 }
    );
  }
}
//http://localhost:3000/api/restaurant/vivaan-fine-indian-cuisine-ottawa/availability?day=2023-01-01&time=20:00:00:000Z&partySize=2
