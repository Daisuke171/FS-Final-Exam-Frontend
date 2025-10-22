import { handlers } from "@/auth";

if (!handlers) {
  throw new Error(
    "NextAuth handlers no están definidos correctamente en auth.ts"
  );
}

export const { GET, POST } = handlers;
