import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { CardSchema } from "../../../components/MakeCardForm";

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
});
