import type { User } from "@prisma/client";
import { Resend } from "resend";
import { z } from "zod";
import { Goodbye } from "~/components/templates/Goodbye";
import { env } from "~/env.mjs";
import {
  adminRateLimitedProcedure,
  createTRPCRouter,
  protectedRateLimitedProcedure,
} from "~/server/api/trpc";

import { fetchCache, invalidateCache, setCache } from "~/server/redis";

const resend = new Resend(process.env.RESEND_API_KEY);

export const userRouter = createTRPCRouter({
  countAll: adminRateLimitedProcedure.query(async ({ ctx }) => {
    const cachedResult = await fetchCache<number>(`kv_usercount_admin`);

    if (cachedResult) {
      return cachedResult;
    } else {
      const usersCount = await ctx.prisma.user.count();

      await setCache(`kv_usercount_admin`, usersCount);

      return usersCount;
    }
  }),

  getProviders: protectedRateLimitedProcedure.query(async ({ ctx }) => {
    const providers = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        accounts: {
          select: {
            provider: true,
          },
        },
      },
    });

    return providers?.accounts.map((account) => {
      return account.provider;
    });
  }),
  getAll: protectedRateLimitedProcedure.query(async ({ ctx }) => {
    const cachedResult = await fetchCache<
      {
        accounts: {
          provider: string;
        }[];
        sessions: {
          id: string;
        }[];
        id: string;
        createdAt: Date;
        isAdmin: boolean;
        isVIP: boolean;
        name: string | null;
        email: string | null;
      }[]
    >(`kv_userlist_admin`);

    if (cachedResult) {
      return cachedResult.map((user) => {
        return {
          ...user,
          createdAt: new Date(user.createdAt),
        };
      });
    } else {
      const users = await ctx.prisma.user.findMany({
        select: {
          id: true,
          name: true,
          isAdmin: true,
          isVIP: true,
          createdAt: true,
          email: true,
          sessions: {
            select: {
              id: true,
            },
          },
          accounts: {
            select: {
              provider: true,
            },
          },
        },
      });

      await setCache(`${env.APP_ENV}_kv_userlist_admin`, users);

      return users;
    }
  }),
  delete: protectedRateLimitedProcedure
    .input(
      z
        .object({
          userId: z.string(),
        })
        .optional()
    )
    .mutation(async ({ ctx, input }) => {
      let user: User;
      if (input?.userId && ctx.session.user.isAdmin) {
        user = await ctx.prisma.user.delete({
          where: {
            id: input.userId,
          },
        });
      } else {
        user = await ctx.prisma.user.delete({
          where: {
            id: ctx.session.user.id,
          },
        });
      }

      if (!!user && user.name && user.email) {
        await resend.emails.send({
          from: "Sprint Padawan <no-reply@sprintpadawan.dev>",
          to: user.email,
          subject: "Sorry to see you go... 😭",
          react: Goodbye({ name: user.name }),
        });

        await invalidateCache(`kv_usercount_admin`);
        await invalidateCache(`kv_userlist_admin`);
      }

      return !!user;
    }),
  save: protectedRateLimitedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          name: input.name,
        },
      });

      return !!user;
    }),
  setAdmin: adminRateLimitedProcedure
    .input(
      z.object({
        userId: z.string(),
        value: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: {
          id: input.userId,
        },
        data: {
          isAdmin: input.value,
        },
      });

      await invalidateCache(`kv_userlist_admin`);

      return !!user;
    }),

  setVIP: adminRateLimitedProcedure
    .input(
      z.object({
        userId: z.string(),
        value: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: {
          id: input.userId,
        },
        data: {
          isVIP: input.value,
        },
      });

      await invalidateCache(`kv_userlist_admin`);

      return !!user;
    }),
});
