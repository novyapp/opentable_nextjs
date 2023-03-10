import Price from "@/app/components/Price";
import Stars from "@/app/components/Stars";
import { calculateReviewRatingAverage } from "@/utils/calculateReviewRatingAverage";
import Link from "next/link";
import { RestaurantByCity } from "../page";

interface RestaurantSearchCardProps {
  restaurant: RestaurantByCity;
}

export default function RestaurantCard({
  restaurant,
}: RestaurantSearchCardProps) {
  const renderRatingText = () => {
    const rating = calculateReviewRatingAverage(restaurant.review);
    return rating > 4
      ? "Awesome"
      : rating <= 4 && rating > 3
      ? "Good"
      : rating <= 3 && rating > 0
      ? "Average"
      : "";
  };

  return (
    <div className="border-b flex pb-5 pt-5">
      <img src={restaurant.main_image} alt="" className="w-44 h-36 rounded" />
      <div className="pl-5">
        <h2 className="text-3xl">{restaurant.name}</h2>
        <div className="flex items-start">
          <div className="flex mb-2">
            <Stars reviews={restaurant.review} />
          </div>
          <p className="ml-2 text-sm">{renderRatingText()}</p>
        </div>
        <div className="mb-9">
          <div className="font-light flex text-reg capitalize">
            <Price price={restaurant.price} />
            <p className="mr-4 ">{restaurant.cuisine.name}</p>
            <p className="mr-4">{restaurant.location.name}</p>
          </div>
        </div>
        <div className="text-red-600">
          <Link href={`/restaurant/${restaurant.slug}`}>
            View more information
          </Link>
        </div>
      </div>
    </div>
  );
}
