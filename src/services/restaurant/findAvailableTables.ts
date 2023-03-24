import { times } from "@/data";
import prisma from "@/utils/prisma.utils";
import { NextResponse } from "next/server";
import { Table } from "@prisma/client";

interface SearchTimesWithTables {
  date: Date;
  time: string;
  tables: Table[];
}

export const findAvailabileTables = async ({
  time,
  day,
  restaurant,
}: {
  time: string;
  day: string;
  restaurant: {
    tables: Table[];
    open_time: string;
    close_time: string;
  };
}) => {
  //looking for closest times
  const searchTimes = times.find((t) => {
    return t.time === time;
  })?.searchTimes;

  if (!searchTimes) {
    return NextResponse.json(
      { errorMessage: "Invalid data provided." },
      { status: 400 }
    );
  }

  //Fetch bookings
  const bookings = await prisma.booking.findMany({
    where: {
      booking_time: {
        gte: new Date(`${day}T${searchTimes[0]}`),
        lte: new Date(`${day}T${searchTimes[searchTimes.length - 1]}`),
      },
    },
    select: {
      number_of_people: true,
      booking_time: true,
      tables: true,
    },
  });

  //Compresing bookings
  const bookingTableObj: { [key: string]: { [key: number]: true } } = {};

  bookings.forEach((booking) => {
    bookingTableObj[booking.booking_time.toISOString()] = booking.tables.reduce(
      (obj, table) => {
        return { ...obj, [table.table_id]: true };
      },
      {}
    );
  });

  const tables = restaurant.tables;

  //Showing what tables are avaible on time
  const searchTimesWithTables = searchTimes.map((searchTime) => {
    return {
      date: new Date(`${day}T${searchTime}`),
      time: searchTime,
      tables,
    };
  });

  searchTimesWithTables.forEach((t) => {
    t.tables = t.tables.filter((table) => {
      if (bookingTableObj[t.date.toISOString()]) {
        if (bookingTableObj[t.date.toISOString()][table.id]) return false;
      }
      return true;
    });
  });

  console.log("search", searchTimesWithTables);

  return searchTimesWithTables as SearchTimesWithTables[];
};
