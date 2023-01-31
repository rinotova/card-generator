import Image from "next/image";
import React, { useState } from "react";
import SkeletonCard from "./SkeletonCard";

function FrontCard({ ogImageUrl }: { ogImageUrl: string }) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const classVisivility = isLoading ? "hidden" : "";
  return (
    <div className="card-front relative">
      {isLoading && <SkeletonCard />}
      <Image
        className={classVisivility}
        src={ogImageUrl}
        alt="Business card"
        width={480}
        height={240}
        quality={100}
        priority={true}
        onLoadingComplete={() => setIsLoading(false)}
      />
    </div>
  );
}

export default FrontCard;
