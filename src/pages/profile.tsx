/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { getSession, useSession } from "next-auth/react";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import CenteredLayout from "../components/Layout/CenteredLayout";
import { useState } from "react";
import Heading from "../components/Layout/Heading";
import { prisma } from "../server/db";
import type { User } from "@prisma/client";
import { api } from "../utils/api";
import { Toaster, toast } from "react-hot-toast";

const UserProfile = ({ user }: { user: User }) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [isPublic, setIsPublic] = useState(user.public);
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    void router.push("/");
    return;
  }

  const theUrl =
    process.env.NODE_ENV === "development"
      ? `${process.env.NEXT_PUBLIC_DEV_URL}/${session.user?.userName}`
      : `${process.env.NEXT_PUBLIC_PROD_URL}/${session.user?.userName}`;

  const { mutate, isLoading } =
    api.userRouter.updateUsersProfileVisibility.useMutation({
      onMutate: (data) => {
        setIsPublic(data.isPublic);
      },
      onSuccess: (userProfile) => {
        setIsPublic(userProfile.public);
      },
      onError: (error) => {
        toast.error(error.message, { duration: 4000 });
      },
    });

  const handleCopy = (value: string) => {
    toast.success("Link copied!", { duration: 3000 });
    void navigator.clipboard.writeText(value);
  };

  return (
    <>
      <Toaster />
      <CenteredLayout>
        <Heading>My Profile</Heading>
        <form className="mb-4 w-full rounded-lg bg-white p-6 shadow-md md:w-[60%]">
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              onChange={(e) => {
                mutate({ isPublic: e.target.checked });
              }}
              type="checkbox"
              value=""
              className="peer sr-only"
              checked={isPublic}
              disabled={isLoading}
            />
            <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-blue-300 "></div>
            <span className="ml-3 text-sm font-medium text-black">
              Make my cards public
            </span>
          </label>
        </form>
        {isPublic && (
          <div className="flex w-full items-center rounded-lg border border-gray-300 p-2 md:w-[60%]">
            <input
              className="focus:shadow-outline w-full p-2 outline-none focus:border-indigo-500"
              type="text"
              value={theUrl}
              disabled={true}
            />
            <button
              className="ml-2 rounded-full bg-indigo-500 p-2 font-bold text-white hover:bg-indigo-600"
              onClick={handleCopy.bind(null, theUrl)}
            >
              Copy
            </button>
          </div>
        )}
      </CenteredLayout>
    </>
  );
};

export default UserProfile;

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

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
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
      user,
    },
  };
};
