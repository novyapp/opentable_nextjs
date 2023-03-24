import Menu from "../components/Menu";
import RestaurantNavbar from "../components/RestaurantNavbar";

export const metadata = {
  title: "Menu of - OpenTable",
};

import prisma from "@/utils/prisma.utils";

const fetchRestaurantMenu = async (slug: string) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
    select: {
      item: true,
    },
  });

  if (!restaurant) {
    throw new Error();
  }

  return restaurant.item;
};

export default async function RestaurantMenu({
  params,
}: {
  params: { slug: string };
}) {
  const menu = await fetchRestaurantMenu(params.slug);

  return (
    <div className="bg-white w-[100%] rounded p-3 shadow">
      <RestaurantNavbar slug={params.slug} />
      <Menu menu={menu} />
    </div>
  );
}
