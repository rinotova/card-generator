import { useRouter } from "next/router";
import type { TheCardType } from "../../components/BusinessCard/Card";
import Card from "../../components/BusinessCard/Card";
import { api } from "../../utils/api";
import Spinner from "../../components/Spinner";
import CenteredLayout from "../../components/Layout/CenteredLayout";
import Heading from "../../components/Layout/Heading";

const UserProfileDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const idParam = id as string;
  const { isLoading, data } = api.cardRouter.getCardById.useQuery(
    { cardId: idParam },
    { enabled: !!idParam }
  );

  const card = data as TheCardType;

  // Card doesn't exist
  if (id && !isLoading && !card) {
    void router.push("/");
    return;
  }
  return (
    <>
      {isLoading && <Spinner />}
      {!isLoading && card && (
        <CenteredLayout>
          <Heading>The Business Card</Heading>
          <Card card={card} publicViewing={true} />
        </CenteredLayout>
      )}
    </>
  );
};

export default UserProfileDetailPage;
