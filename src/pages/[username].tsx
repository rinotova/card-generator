import { useRouter } from "next/router";
import type { TheCardType } from "../components/BusinessCard/Card";
import CardsGrid from "../components/CardsGrid";
import CenteredLayout from "../components/Layout/CenteredLayout";
import Heading from "../components/Layout/Heading";
import Spinner from "../components/Spinner";
import { api } from "../utils/api";

type User = {
  businessCards: TheCardType[];
  name: string;
  public: boolean;
};

const UserProfileDetailPage = () => {
  const router = useRouter();
  const { username } = router.query;
  const usernameParam = username as string;
  const { isLoading, data } = api.userRouter.getUserByUsername.useQuery(
    { username: usernameParam },
    { enabled: !!usernameParam }
  );
  const user = data as User;

  // User doesn't exist
  if (username && !isLoading && !user) {
    void router.push("/");
    return;
  }
  return (
    <>
      {isLoading && <Spinner />}
      {!isLoading && user && (
        <CenteredLayout>
          <Heading>{user.name}&#39;s Cards</Heading>
          {user.businessCards.length !== 0 && (
            <CardsGrid
              cards={user.businessCards}
              publicViewing={true}
            ></CardsGrid>
          )}
          {user.businessCards.length === 0 && (
            <p>No cards in this profile yet.</p>
          )}
        </CenteredLayout>
      )}
    </>
  );
};

export default UserProfileDetailPage;
