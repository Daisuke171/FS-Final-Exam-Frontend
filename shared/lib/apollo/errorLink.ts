import { CombinedGraphQLErrors } from "@apollo/client";
import { ErrorLink } from "@apollo/client/link/error";

export const errorLink = new ErrorLink(({ error, operation, forward }) => {
  if (CombinedGraphQLErrors.is(error)) {
    error.errors.forEach(({ message, extensions }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Operation: ${operation.operationName}`
      );

      if (
        extensions?.code === "UNAUTHENTICATED" ||
        message.toLowerCase().includes("unauthorized") ||
        message.toLowerCase().includes("unauthenticated") ||
        message.toLowerCase().includes("authentication required") ||
        message.toLowerCase().includes("refresh token")
      ) {
        console.error("❌ Error de autenticación detectado en GraphQL");
        if (
          typeof window !== "undefined" &&
          !window.location.pathname.includes("/login")
        ) {
          console.log("🔄 Redirigiendo al login por sesión inválida...");
          window.location.href = "/login?error=SessionExpired";
        }
      }
    });
  } else {
    console.error(`[Network error]: ${error}`);
    if (error && "statusCode" in error) {
      const statusCode = (error as any).statusCode;
      if (statusCode === 401 || statusCode === 403) {
        console.error("❌ Error 401/403 detectado");
        if (
          typeof window !== "undefined" &&
          !window.location.pathname.includes("/login")
        ) {
          window.location.href = "/login?error=SessionExpired";
        }
      }
    }
  }
});
