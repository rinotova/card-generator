import { type NextPage } from "next";
import type { GetSessionParams } from "next-auth/react";
import { getSession } from "next-auth/react";
import HomepageWelcomeSplash from "../components/HomepageWelcomeSplash";
import CenteredLayout from "../components/Layout/CenteredLayout";

const Home: NextPage = () => {
  return (
    <CenteredLayout>
      <HomepageWelcomeSplash />
    </CenteredLayout>
  );
};

export default Home;

export const getServerSideProps = async (
  context: GetSessionParams | undefined
) => {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
};
