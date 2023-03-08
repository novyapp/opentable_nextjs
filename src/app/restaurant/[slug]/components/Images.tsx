import React from "react";

export default function Images({ images }: { images: string[] }) {
  return (
    <div>
      <h1 className="font-bold text-3xl mt-10 mb-7 border-b pb-5">
        {images.length > 1
          ? `${images.length} photos`
          : `${images.length} photo`}
      </h1>
      <div className="flex flex-wrap">
        {images.map((image) => (
          <img className="w-56 h-44 mr-1 mb-1" src={image} alt="" />
        ))}
      </div>
    </div>
  );
}
