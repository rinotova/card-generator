import { type NextPage } from "next";
import type { GetSessionParams } from "next-auth/react";
import { signIn } from "next-auth/react";
import { useSession, getSession } from "next-auth/react";
import Head from "next/head";
import BusinessCard from "../components/BusinessCard/BusinessCard";
import type { FormEvent } from "react";
import { useRef } from "react";
import { api } from "../utils/api";
import toast, { Toaster } from "react-hot-toast";

class Card {
  email: string;
  name: string;
  title: string;
  website?: string;
  constructor(name: string, email: string, title: string, website?: string) {
    this.email = email;
    this.name = name;
    this.title = title;
    this.website = website;
  }
}

const Home: NextPage = () => {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const websiteRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();

  const signInHandler = () => {
    void signIn("google");
  };

  const { mutate: publishCard } = api.cardRouter.createCard.useMutation({
    onSuccess: () => {
      if (
        nameRef.current &&
        emailRef.current &&
        titleRef.current &&
        websiteRef.current
      ) {
        nameRef.current.value = "";
        emailRef.current.value = "";
        titleRef.current.value = "";
        websiteRef.current.value = "";
      }
      toast.success("The card has been created!");
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  function publishHandler(e: FormEvent) {
    e.preventDefault();
    if (
      nameRef.current &&
      emailRef.current &&
      titleRef.current &&
      websiteRef.current
    ) {
      publishCard(
        new Card(
          nameRef.current.value,
          emailRef.current.value,
          titleRef.current.value,
          websiteRef.current.value
        )
      );
    }
  }

  return (
    <>
      <Head>
        <title>Business card generator</title>
        <meta name="description" content="As seen in The Office" />
      </Head>
      <Toaster />
      <div className="to flex h-[calc(100vh-4rem)] flex-col items-center justify-center bg-purple-600 bg-gradient-to-br from-rose-500">
        {!session && (
          <button
            onClick={signInHandler}
            className="rounded-full bg-black/10 px-10 py-3 font-semibold text-black no-underline transition hover:bg-black/20"
          >
            Sign in with Google
          </button>
        )}

        {/* Tell us about yourself inputs */}
        {session && (
          <form onSubmit={publishHandler}>
            <div className="mx-auto max-w-7xl">
              <h2 className="mb-6 text-left text-3xl font-semibold text-white">
                Tell us about yourself
              </h2>
              <div className="mb-12 grid grid-cols-2 gap-8">
                {/* Input field 1 */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-white"
                  >
                    Name
                  </label>
                  <div className="mt-1">
                    <input
                      ref={nameRef}
                      type="text"
                      name="name"
                      required
                      minLength={3}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Name"
                    />
                  </div>
                </div>

                {/* Input field 2 */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-white"
                  >
                    Email
                  </label>
                  <div className="mt-1">
                    <input
                      ref={emailRef}
                      type="email"
                      name="email"
                      required
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="email@domain.com"
                    />
                  </div>
                </div>

                {/* Input field 1 */}
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-white"
                  >
                    Title
                  </label>
                  <div className="mt-1">
                    <input
                      ref={titleRef}
                      type="text"
                      name="title"
                      required
                      minLength={2}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Title"
                    />
                  </div>
                </div>

                {/* Input field 2 */}
                <div>
                  <label
                    htmlFor="website"
                    className="block text-sm font-medium text-white"
                  >
                    Website
                  </label>
                  <div className="mt-1">
                    <input
                      ref={websiteRef}
                      type="text"
                      name="website"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="yoursite.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* main business card */}
            <div className="flex flex-col items-center justify-center">
              <BusinessCard />
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
        )}
      </div>
    </>
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
