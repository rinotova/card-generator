import React, { useState } from "react";
import Card from "./BusinessCard/Card";
import type { FormEvent } from "react";
import { api } from "../utils/api";
import toast, { Toaster } from "react-hot-toast";
import Heading from "./Layout/Heading";
import Spinner from "./Spinner";
import { object, z } from "zod";
import FormInput from "./FormInput";

export const CardSchema = object({
  name: z.string().min(8),
  email: z.string().email(),
  title: z.string(),
  website: z.string().optional(),
});

function MakeCardForm() {
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    title: "",
    website: "",
  });

  const trpcUtils = api.useContext();
  const { mutate: publishCard, isLoading } =
    api.cardRouter.createCard.useMutation({
      onSuccess: () => {
        setInputs({
          name: "",
          email: "",
          title: "",
          website: "",
        });
        toast.success("The card has been created!");
        void trpcUtils.cardRouter.getCardsByUser.prefetch();
      },
      onError: (e) => {
        toast.error(e.message);
      },
    });

  function publishHandler(e: FormEvent) {
    e.preventDefault();
    const cardInfo = {
      name: inputs.name,
      email: inputs.email,
      title: inputs.title,
      website: inputs.website,
    };
    try {
      CardSchema.parse(cardInfo);
    } catch (e) {
      toast.error("The info provided is not complete");
      return;
    }
    publishCard(cardInfo);
  }
  return (
    <>
      {isLoading && <Spinner />}
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
              }}
              isMakeCard={true}
            />
          </div>

          {/* Publish Button */}
          <div className="mt-12 flex justify-center">
            <button
              type="submit"
              className="rounded-full bg-black/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-black/20"
            >
              Publish
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default MakeCardForm;
