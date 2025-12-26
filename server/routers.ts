import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { createWaitlistEntry, getAllWaitlistEntries } from "./db";
import { storagePut } from "./storage";
import { z } from "zod";
import { nanoid } from "nanoid";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  waitlist: router({
    /**
     * Public procedure to join the waitlist.
     * Demonstrates S3 file storage integration.
     */
    join: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          name: z.string().optional(),
          /** Base64-encoded file data (optional) */
          fileData: z.string().optional(),
          fileName: z.string().optional(),
          fileMimeType: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        let attachmentUrl: string | undefined;
        let attachmentKey: string | undefined;
        let attachmentFilename: string | undefined;
        let attachmentMimeType: string | undefined;

        // If file data is provided, upload to S3
        if (input.fileData && input.fileName) {
          const buffer = Buffer.from(input.fileData, "base64");
          const randomSuffix = nanoid(8);
          const fileKey = `waitlist-attachments/${input.email}-${randomSuffix}-${input.fileName}`;
          
          const { url } = await storagePut(
            fileKey,
            buffer,
            input.fileMimeType || "application/octet-stream"
          );

          attachmentUrl = url;
          attachmentKey = fileKey;
          attachmentFilename = input.fileName;
          attachmentMimeType = input.fileMimeType;
        }

        await createWaitlistEntry({
          email: input.email,
          name: input.name,
          attachmentUrl,
          attachmentKey,
          attachmentFilename,
          attachmentMimeType,
        });

        return { success: true };
      }),

    /**
     * Protected procedure to list all waitlist entries.
     * Only accessible to authenticated users (for demo purposes).
     */
    list: protectedProcedure.query(async () => {
      return await getAllWaitlistEntries();
    }),
  }),
});

export type AppRouter = typeof appRouter;
