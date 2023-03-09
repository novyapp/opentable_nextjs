import { Cuisine, PRICE, PrismaClient, Location, Review } from "@prisma/client";
import React from "react";
import Header from "./components/Header";
import RestaurantCard from "./components/RestaurantCard";
import SearchSideBar from "./components/SearchSideBar";

export const metadata = {
  title: "Search - OpenTable",
};

interface SearchParamas {
  city?: string;
  cuisine?: string;
  price?: PRICE;
}

export interface RestaurantByCity {
  id: number;
  name: string;
  slug: string;
  main_image: string;
  location: Location;
  cuisine: Cuisine;
  price: PRICE;
  review: Review[];
}

const prisma = new PrismaClient();

const fetchRestaurantsByLocation = (
  searchParams: SearchParamas
): Promise<RestaurantByCity[]> => {
  const where: any = {};

  if (searchParams.city) {
    const location = {
      name: {
        equals: searchParams.city.toLowerCase(),
      },
    };
    where.location = location;
  }

  if (searchParams.cuisine) {
    const cuisine = {
      name: {
        equals: searchParams.cuisine.toLowerCase(),
      },
    };
    where.cuisine = cuisine;
  }

  if (searchParams.price) {
    const price = {
      equals: searchParams.price,
    };
    where.price = price;
  }

  const select = {
    id: true,
    name: true,
    slug: true,
    main_image: true,
    location: true,
    cuisine: true,
    price: true,
    review: true,
  };

  if (!searchParams) return prisma.restaurant.findMany({ select });

  return prisma.restaurant.findMany({
    where,
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
  searchParams: SearchParamas;
}) {
  const restaurants = await fetchRestaurantsByLocation(searchParams);
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
