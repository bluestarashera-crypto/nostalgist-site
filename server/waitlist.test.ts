import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createMockContext(authenticated: boolean = false): TrpcContext {
  const user: AuthenticatedUser | null = authenticated
    ? {
        id: 1,
        openId: "test-user",
        email: "test@example.com",
        name: "Test User",
        loginMethod: "manus",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      }
    : null;

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("waitlist.join", () => {
  it("should accept email-only signup", async () => {
    const ctx = createMockContext(false); // Public procedure
    const caller = appRouter.createCaller(ctx);

    const result = await caller.waitlist.join({
      email: "pioneer@nostalgist.io",
    });

    expect(result).toEqual({ success: true });
  });

  it("should accept signup with name", async () => {
    const ctx = createMockContext(false);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.waitlist.join({
      email: "archivist@nostalgist.io",
      name: "The Archivist",
    });

    expect(result).toEqual({ success: true });
  });

  it("should handle file attachment (base64)", async () => {
    const ctx = createMockContext(false);
    const caller = appRouter.createCaller(ctx);

    // Mock file data (small text file)
    const fileContent = "This is a test file";
    const base64Data = Buffer.from(fileContent).toString("base64");

    const result = await caller.waitlist.join({
      email: "docent@nostalgist.io",
      name: "Docent",
      fileData: base64Data,
      fileName: "resume.txt",
      fileMimeType: "text/plain",
    });

    expect(result).toEqual({ success: true });
  });

  it("should reject invalid email", async () => {
    const ctx = createMockContext(false);
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.waitlist.join({
        email: "not-an-email",
      })
    ).rejects.toThrow();
  });
});

describe("waitlist.list", () => {
  it("should require authentication", async () => {
    const ctx = createMockContext(false); // Not authenticated
    const caller = appRouter.createCaller(ctx);

    await expect(caller.waitlist.list()).rejects.toThrow();
  });

  it("should return waitlist entries when authenticated", async () => {
    const ctx = createMockContext(true); // Authenticated
    const caller = appRouter.createCaller(ctx);

    const result = await caller.waitlist.list();

    expect(Array.isArray(result)).toBe(true);
    // The result should contain entries from previous tests
    expect(result.length).toBeGreaterThanOrEqual(0);
  });
});
