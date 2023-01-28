import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  getUserById: protectedProcedure.query(({ ctx }) => {
    const { prisma, session } = ctx;
    if (!session) {
      throw new TRPCError({
        message: "Please log in first",
        code: "UNAUTHORIZED",
      });
    }
    return prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });
  }),
  getUserByUsername: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      const { prisma } = ctx;
      const { username } = input;
      console.log(username);
      if (!username) {
        throw new TRPCError({
          message: "Please use a valid username",
          code: "UNAUTHORIZED",
        });
      }

      return prisma.user.findUnique({
        where: {
          userName_public: {
            userName: username,
            public: true,
          },
        },
        select: {
          businessCards: true,
          name: true,
          public: true,
        },
      });
    }),
  updateUsersProfileVisibility: protectedProcedure
    .input(
      z.object({
        isPublic: z.boolean(),
      })
    )
    .mutation(({ ctx, input }) => {
      const { prisma, session } = ctx;
      if (!session) {
        throw new TRPCError({
          message: "Please log in first",
          code: "UNAUTHORIZED",
        });
      }
      return prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          public: input.isPublic,
        },
      });
    }),
});
