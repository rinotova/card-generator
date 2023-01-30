import { getSession } from "next-auth/react";
import MakeCardForm from "../../components/MakeCardForm";
import type { GetServerSideProps } from "next";
import CenteredLayout from "../../components/Layout/CenteredLayout";
import { prisma } from "../../server/db";

const MakeCard = ({
  card,
}: {
  card: {
    id: string;
    name: string;
    title: string;
    website?: string;
    email: string;
    slug?: string;
    imgSrc?: string;
  };
}) => {
  return (
    <CenteredLayout>
      <MakeCardForm editMode={true} card={card} />
    </CenteredLayout>
  );
};

export default MakeCard;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const userId = session?.user?.id;
  if (!userId) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const cardId = context.params?.id as string;

  if (!cardId) {
    return {
      redirect: {
        destination: "/makeCard",
        permanent: false,
      },
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  const card = (await prisma.businessCard.findUnique({
    where: {
      id_authorId: {
        id: cardId,
        authorId: userId,
      },
    },
    select: {
      id: true,
      name: true,
      title: true,
      website: true,
      email: true,
      slug: true,
    },
  })) as unknown;

  if (!card) {
    return {
      redirect: {
        destination: "/makeCard",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
      card,
    },
  };
};
