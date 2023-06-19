import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { env } from "~/env.mjs";
import { redis } from "~/server/redis";

export const sessionRouter = createTRPCRouter({
  deleteAll: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const sessions = await ctx.prisma.session.deleteMany({
        where: {
          userId: input.userId,
        },
      });

      if (!!sessions) {
        await redis.del(`${env.APP_ENV}_kv_userlist_admin`);
      }

      return !!sessions;
    }),
});
