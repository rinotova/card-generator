import type { GetSessionParams } from "next-auth/react";
import { getSession } from "next-auth/react";
import MakeCardForm from "../../components/MakeCardForm";
import type { NextPage } from "next";
import CenteredLayout from "../../components/Layout/CenteredLayout";
import { api } from "../../utils/api";

const MakeCard: NextPage = () => {
  const trpcUtils = api.useContext();
  void trpcUtils.cardRouter.getCardsByUser.prefetch();
  return (
    <CenteredLayout>
      <MakeCardForm />
    </CenteredLayout>
  );
};

export default MakeCard;

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
