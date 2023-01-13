import { z } from "zod";
import { procedure, router } from "../trpc";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const appRouter = router({
  todo: router({
    list: procedure.input(z.undefined()).query(async (_) => {
      const todos = await prisma.todo.findMany();
      return todos;
    }),

    create: procedure
      .input(
        z.object({
          title: z.string(),
          description: z.string(),
          deadline: z
            .string()
            .optional()
            .refine(
              (deadline) =>
                typeof deadline === "undefined" ||
                !Number.isNaN(new Date(deadline))
            ),
        })
      )
      .mutation(async ({ input }) => {
        const todo = await prisma.todo.create({
          data: {
            ...input,
            deadline: input.deadline ? new Date(input.deadline) : undefined,
          },
        });
        return todo;
      }),

    delete: procedure.input(z.number()).mutation(async ({ input }) => {
      await prisma.todo.delete({ where: { id: input } });
    }),

    update: procedure
      .input(
        z.object({
          id: z.number(),
          title: z.string(),
          description: z.string(),
          deadline: z
            .string()
            .optional()
            .refine(
              (deadline) =>
                typeof deadline === "undefined" ||
                !Number.isNaN(new Date(deadline))
            ),
          completed: z.boolean(),
        })
      )
      .mutation(async ({ input: { id, ...input } }) => {
        await prisma.todo.update({
          data: { ...input },
          where: { id },
        });
      }),
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
