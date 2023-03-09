import { Cuisine, PRICE, PrismaClient, Location } from "@prisma/client";
import React from "react";
import Header from "./components/Header";
import RestaurantCard from "./components/RestaurantCard";
import SearchSideBar from "./components/SearchSideBar";

export const metadata = {
  title: "Search - OpenTable",
};

export interface RestaurantByCity {
  id: number;
  name: string;
  slug: string;
  main_image: string;
  location: Location;
  cuisine: Cuisine;
  price: PRICE;
}

const prisma = new PrismaClient();

const fetchRestaurantsByLocation = (
  city: string | undefined
): Promise<RestaurantByCity[]> => {
  const select = {
    id: true,
    name: true,
    slug: true,
    main_image: true,
    location: true,
    cuisine: true,
    price: true,
  };

  if (!city) return prisma.restaurant.findMany({ select });

  return prisma.restaurant.findMany({
    where: {
      location: {
        name: {
          equals: city.toLowerCase(),
        },
      },
    },
    select,
  });
};

const fetchLocation = async () => {
  return prisma.location.findMany();
};

const fetchCuisine = async () => {
  return prisma.cuisine.findMany();
};

export default async function Search({
  searchParams,
}: {
  searchParams: { city?: string; cuisine?: string; price?: PRICE };
}) {
  const restaurants = await fetchRestaurantsByLocation(searchParams.city);
  const locations = await fetchLocation();
  const cuisines = await fetchCuisine();

  return (
    <>
      <Header />
      <div className="flex py-4 m-auto w-2/3 justify-between items-start">
        <SearchSideBar
          locations={locations}
          cuisines={cuisines}
          searchParams={searchParams}
        />
        <div className="w-5/6">
          {restaurants.length ? (
            restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))
          ) : (
            <p>Sorry we not found restaurants in this area.</p>
          )}
        </div>
      </div>
    </>
  );
}
