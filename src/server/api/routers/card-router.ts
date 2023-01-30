import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { CardSchema } from "../../../components/MakeCardForm";
import { z } from "zod";

function makeid(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const cardRouter = createTRPCRouter({
  createCard: protectedProcedure
    .input(CardSchema)
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { id, image } = session.user;
      const { title, website, name, email } = input;
      let card;

      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        card = (await prisma.businessCard.create({
          data: {
            title,
            website,
            email,
            imgSrc: image,
            name,
            slug: makeid(16),
            author: {
              connect: {
                id,
              },
            },
          },
        })) as unknown;
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
          // The .code property can be accessed in a type-safe manner
          if (e.code === "P2002") {
            throw new TRPCError({
              message:
                "There was an error creating the card, please change the data",
              code: "INTERNAL_SERVER_ERROR",
            });
          }
        }
        throw new TRPCError({
          message: "There was a network error",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
      return card;
    }),
  getCardsByUser: protectedProcedure.query(({ ctx }) => {
    const { prisma, session } = ctx;
    const userId = session.user.id;
    return prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        businessCards: true,
      },
    });
  }),
  deleteCard: protectedProcedure
    .input(
      z.object({
        cardId: z.string(),
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
      return prisma.businessCard.delete({
        where: {
          id_authorId: {
            id: input.cardId,
            authorId: session.user.id,
          },
        },
      });
    }),
  getCardById: publicProcedure
    .input(
      z.object({
        cardId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      const { prisma } = ctx;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
      return prisma.businessCard.findUnique({
        where: {
          id: input.cardId,
        },
      }) as unknown;
    }),
  updateCard: protectedProcedure
    .input(CardSchema)
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { id: userId } = session.user;
      const { title, website, name, email, id: cardId } = input;
      let card;

      if (!cardId) {
        throw new TRPCError({
          message: "Invalid card id",
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        card = (await prisma.businessCard.update({
          where: {
            id_authorId: {
              id: cardId,
              authorId: userId,
            },
          },
          data: {
            title,
            website,
            email,
            name,
          },
        })) as unknown;
      } catch (e) {
        throw new TRPCError({
          message: "There was a network error",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
      return card;
    }),
});
