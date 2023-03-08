import { PRICE } from "@prisma/client";
import React from "react";

export default function Price({ price }: { price: PRICE }) {
  const renderPrice = () => {
    return price === PRICE.CHEAP ? (
      <>
        <span>$$</span>
        <span className="text-gray-400">$$</span>
      </>
    ) : price === PRICE.REGULAR ? (
      <>
        <span>$</span>
        <span className="text-gray-400">$$$</span>
      </>
    ) : (
      <span>$$$$</span>
    );
  };

  return <p className="mr-3 flex">{renderPrice()}</p>;
}
