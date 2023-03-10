/* eslint-disable @typescript-eslint/restrict-template-expressions */
import type { MouseEvent } from "react";
import { FaEdit, FaTrashAlt, FaShare } from "react-icons/fa";
import { api } from "../../utils/api";
import toast, { Toaster } from "react-hot-toast";
import Spinner from "../Spinner";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Link from "next/link";
import { useSession } from "next-auth/react";
import FrontCard from "../FrontCard";

export type TheCardType = {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  email: string;
  imgSrc?: string | null;
  title: string;
  website?: string | null;
  ogUrl: string;
  authorId?: string;
};

const Card = ({
  card,
  isMakeCard = false,
  publicViewing = false,
}: {
  card: TheCardType;
  isMakeCard?: boolean;
  publicViewing?: boolean;
}) => {
  /**
   * Credit for this business card design to Joshua Ward
   * https://codepen.io/joshuaward/pen/YMyPWr
   */
  const { data: session } = useSession();
  const name = card.name || "John Doe";
  const title = card.title;
  const email = card.email;
  const website = card?.website || "www.thewebsite.com";
  const imgSrc = publicViewing ? card.imgSrc : session?.user?.image || "";

  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  const ogImageUrl =
    process.env.NODE_ENV === "development"
      ? `${process.env.NEXT_PUBLIC_DEV_URL}/api/og?username=${name}&title=${title}&imgSrc=${imgSrc}`
      : `${process.env.NEXT_PUBLIC_PROD_URL}/api/og?username=${name}&title=${title}&imgSrc=${imgSrc}`;

  const mouseEnterHandler = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const card = target.closest(".js-card");
    const actionButtons = card ? card.querySelector(".js-actionButtons") : null;
    if (actionButtons) {
      actionButtons.classList.add("fade-in");
    }
  };

  const mouseLeaveHandler = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const card = target.closest(".js-card");
    const actionButtons = card ? card.querySelector(".js-actionButtons") : null;
    if (actionButtons) {
      actionButtons.classList.remove("fade-in");
    }
  };

  // Delete card

  const trpcUtils = api.useContext();
  const { mutateAsync, isLoading } = api.cardRouter.deleteCard.useMutation({
    onSuccess: () => {
      toast.success("Card deleted succesfully!", {
        duration: 4000,
      });
    },
    onSettled: async () => {
      await trpcUtils.cardRouter.getCardsByUser.invalidate();
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });
  const deleteCardHandler = (cardId: string) => {
    const options = {
      title: "Delete",
      message: "Are you sure you want to delete this card?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => mutateAsync({ cardId }),
        },
        {
          label: "No",
        },
      ],
    };
    confirmAlert(options);
  };

  const copyLinkToClipboard = async (id: string | undefined) => {
    if (!id) {
      return;
    }
    const theUrl =
      process.env.NODE_ENV === "development"
        ? `${process.env.NEXT_PUBLIC_DEV_URL}/cardDetail/${id}`
        : `${process.env.NEXT_PUBLIC_PROD_URL}/cardDetail/${id}`;

    console.log(theUrl);

    await navigator.clipboard.writeText(theUrl);
    toast.success("Link copied succesfully!", { duration: 3000 });
  };

  return (
    <>
      {isLoading && <Spinner />}
      <Toaster />
      <div
        className="card js-card relative mt-7 h-48 w-[22rem] sm:h-48 sm:w-96"
        onMouseEnter={mouseEnterHandler}
        onMouseLeave={mouseLeaveHandler}
      >
        {/* Card action buttons*/}
        {card.id && !isMakeCard && !publicViewing && (
          <div className="js-actionButtons flex h-8 items-center justify-center space-x-8 opacity-0 transition-opacity duration-500">
            {/* Share */}
            <FaShare
              className="cursor-pointer opacity-50 transition-opacity duration-300 hover:opacity-100"
              size={"1.2em"}
              title="Edit card info"
              onClick={() => {
                void copyLinkToClipboard(card.id);
              }}
            />

            {/* Edit */}
            <Link href={`/makeCard/${card.id}`}>
              <FaEdit
                className="cursor-pointer opacity-50 transition-opacity duration-300 hover:opacity-100"
                size={"1.2em"}
                title="Edit card info"
              />
            </Link>

            {/* Delete */}
            <FaTrashAlt
              className="cursor-pointer opacity-50 transition-opacity duration-300 hover:opacity-100"
              size={"1.2em"}
              title="Delete card"
              onClick={deleteCardHandler.bind(null, card.id)}
            />
          </div>
        )}

        {/* Back of the card */}

        <div className="card-back">
          <div className="line-numbers">
            <div>1</div>
            <div>2</div>
            <div>3</div>
            <div>4</div>
            <div>5</div>
            <div>6</div>
            <div>7</div>
            <div>8</div>
            <div>9</div>
          </div>
          <code>
            <span className="variable">const </span>
            <span className="function">aboutMe </span>
            <span className="operator">= </span>
            <span>{"{"}</span>
            <div className="indent">
              {" "}
              <span className="property">name</span>
              <span className="operator">: </span>
              <span className="string">&#39;{name}&#39;</span>
              <span>,</span>
            </div>
            <div className="indent">
              {" "}
              <span className="property">title</span>
              <span className="operator">: </span>
              <span className="string">&#39;{title}&#39;</span>
              <span>,</span>
            </div>
            <div className="indent">
              {" "}
              <span className="property">contact</span>
              <span className="operator">: </span>
              <span>{"{"}</span>
              <div className="indent">
                {" "}
                <span className="property">email</span>
                <span className="operator">: </span>
                <span className="string">&#39;{email}&#39;</span>
                <span>,</span>
              </div>
              <div className="indent">
                <span className="property">website</span>
                <span className="operator">:</span>
                <span className="string">&#39;{website}&#39;</span>
              </div>
              <span>{"}"}</span>
            </div>
            <span>{"}"}</span>
          </code>
        </div>

        {/* Front of the card */}
        <FrontCard ogImageUrl={ogImageUrl} />
      </div>
    </>
  );
};

export default Card;
