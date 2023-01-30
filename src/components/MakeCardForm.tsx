/* eslint-disable @typescript-eslint/restrict-template-expressions */

import React, { useState } from "react";
import Card from "./BusinessCard/Card";
import type { FormEvent } from "react";
import { api } from "../utils/api";
import toast, { Toaster } from "react-hot-toast";
import Heading from "./Layout/Heading";
import Spinner from "./Spinner";
import { object, z } from "zod";
import FormInput from "./FormInput";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export const CardSchema = object({
  id: z.string().optional(),
  name: z
    .string()
    .max(20, { message: "Max length for the name is 20 characters" }),
  email: z.string().email({ message: "The email provided is not valid" }),
  title: z
    .string()
    .max(30, { message: "Max length for the name is 30 characters" }),
  website: z.string().optional(),
  imgSrc: z.string().nullish(),
  ogUrl: z.string(),
});

function MakeCardForm({
  card,
  editMode,
}: {
  card?: {
    id: string;
    name: string;
    title: string;
    website?: string;
    email: string;
    ogUrl: string;
    imgSrc?: string;
  };
  editMode?: boolean;
}) {
  const { data: session } = useSession();
  const id = editMode && card ? card.id : "";
  const name = editMode && card ? card.name : "";
  const email = editMode && card ? card.email : "";
  const title = editMode && card ? card.title : "";
  const website = editMode && card ? card.name : "";
  const [inputs, setInputs] = useState({
    name: editMode ? name : "",
    email: editMode ? email : "",
    title: editMode ? title : "",
    website: editMode ? website : "",
  });
  const router = useRouter();
  const trpcUtils = api.useContext();
  const { mutate: publishCard, isLoading: isCreateCardLoading } =
    api.cardRouter.createCard.useMutation({
      onSuccess: () => {
        setInputs({
          name: "",
          email: "",
          title: "",
          website: "",
        });
        toast.success("The card has been created!", { duration: 4000 });
        void trpcUtils.cardRouter.getCardsByUser.prefetch();
      },
      onError: (e) => {
        toast.error(e.message, { duration: 4000 });
      },
    });

  const { mutate: updateCard, isLoading: isUpdateLoading } =
    api.cardRouter.updateCard.useMutation({
      onSuccess: () => {
        setInputs({
          name: "",
          email: "",
          title: "",
          website: "",
        });
        void trpcUtils.cardRouter.getCardsByUser.prefetch();
        void router.push("/makeCard");
        toast.success("The card has been updated!", { duration: 4000 });
      },
      onError: (e) => {
        toast.error(e.message);
      },
    });

  function publishHandler(e: FormEvent) {
    e.preventDefault();

    const ogImageUrl =
      process.env.NODE_ENV === "development"
        ? `${process.env.NEXT_PUBLIC_DEV_URL}/api/og?username=${inputs.name}&title=${inputs.title}&imgSrc=${session?.user?.image}&preview=true`
        : `${process.env.NEXT_PUBLIC_PROD_URL}/api/og?username=${inputs.name}&title=${inputs.title}&imgSrc=${session?.user?.image}&preview=true`;
    const cardInfo = {
      name: inputs.name,
      email: inputs.email,
      title: inputs.title,
      website: inputs.website,
      ogUrl: ogImageUrl,
    };
    try {
      CardSchema.parse(cardInfo);
    } catch (e: unknown) {
      if (e instanceof z.ZodError) {
        e.issues.forEach((issue) => {
          toast.error(issue.message, { duration: 3000 });
        });
      } else {
        toast.error("There is an error in the info provided");
      }

      return;
    }

    if (editMode) {
      updateCard({ ...cardInfo, id });
    } else {
      publishCard({ ...cardInfo, imgSrc: session?.user?.image });
    }
  }
  return (
    <>
      {isCreateCardLoading || (isUpdateLoading && <Spinner />)}
      <Toaster />
      <div className="md:w-[60%]">
        <form onSubmit={publishHandler}>
          <Heading>Tell us about yourself</Heading>

          <div className="mb-3 grid grid-cols-1 gap-6 sm:mb-12 md:grid-cols-2 md:gap-8">
            {/* Input field Name */}
            <FormInput
              label="name"
              required={true}
              value={inputs.name}
              setState={setInputs}
              placeholder="Name"
              maxLength={20}
            />

            {/* Input field Email */}
            <FormInput
              label="email"
              required={true}
              value={inputs.email}
              setState={setInputs}
              placeholder="email@domain.com"
              type="email"
            />

            {/* Input field Title */}
            <FormInput
              label="title"
              required={true}
              value={inputs.title}
              setState={setInputs}
              placeholder="Title"
              maxLength={30}
            />

            {/* Input field Website */}
            <FormInput
              label="website"
              required={false}
              value={inputs.website}
              setState={setInputs}
              placeholder="yoursite.com"
            />

            <p className="text-sm text-white">(*) Required</p>
          </div>

          {/* main business card */}
          <div className="flex flex-col items-center justify-center">
            <Card
              card={{
                name: inputs.name,
                title: inputs.title,
                email: inputs.email,
                website: inputs.website,
                ogUrl: "",
              }}
              isMakeCard={true}
            />
          </div>

          {/* Publish Button */}
          <div className="mt-8 flex justify-center sm:mt-12">
            <button
              type="submit"
              className="rounded-full bg-black/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-black/20"
            >
              {editMode ? "Update" : "Publish"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default MakeCardForm;
