import React from "react";
import type { TheCardType } from "./BusinessCard/Card";
import Card from "./BusinessCard/Card";

function CardsGrid({ cards }: { cards: TheCardType[] }) {
  return (
    <div className="mx-auto grid gap-5 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      {cards.map((card: TheCardType) => (
        <Card key={card.id} card={card} />
      ))}
    </div>
  );
}

export default CardsGrid;
