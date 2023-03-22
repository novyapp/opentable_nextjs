import { Review } from "@prisma/client";
import React from "react";
import ReviewCard from "./ReviewCard";

export default function Reviews({ reviews }: { reviews: Review[] }) {
  return (
    <div>
      <h1 className="font-bold text-3xl mt-10 mb-7 borber-b pb-5">
        {reviews.length
          ? `What ${reviews.length} ${
              reviews.length === 1 ? "person is" : "people are"
            }  saying`
          : `No reviews, be first one.`}
      </h1>
      <div>
        {reviews?.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
