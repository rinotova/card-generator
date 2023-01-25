import type { NextPage } from "next";
import GenericLayout from "../components/Layout/GenericLayout";
import CardsGrid from "../components/CardsGrid";
import Heading from "../components/Layout/Heading";
import { api } from "../utils/api";
import type { TheCardType } from "../components/BusinessCard/Card";
import type { GetSessionParams } from "next-auth/react";
import { getSession } from "next-auth/react";
import Spinner from "../components/Spinner";

const MyCards: NextPage = () => {
  const { data: cards, isLoading } = api.cardRouter.getCardsByUser.useQuery();
  return (
    <>
      {isLoading && <Spinner />}
      <GenericLayout>
        <Heading>My Cards</Heading>
        {cards?.businessCards && (
          <CardsGrid cards={cards.businessCards as TheCardType[]}></CardsGrid>
        )}
      </GenericLayout>
    </>
  );
};

export default MyCards;

export const getServerSideProps = async (
  context: GetSessionParams | undefined
) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};
