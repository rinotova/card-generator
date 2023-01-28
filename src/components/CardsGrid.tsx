import React from "react";
import type { TheCardType } from "./BusinessCard/Card";
import Card from "./BusinessCard/Card";

function CardsGrid({
  cards,
  publicViewing = false,
}: {
  cards: TheCardType[];
  publicViewing?: boolean;
}) {
  return (
    <div className="mx-auto grid gap-5 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      {cards.map((card: TheCardType) => (
        <Card key={card.id} card={card} publicViewing={publicViewing} />
      ))}
    </div>
  );
}

export default CardsGrid;
