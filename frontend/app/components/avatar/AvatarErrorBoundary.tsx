import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { ErrorFallback } from "~/components/common/ErrorFallback";

export function AvatarErrorBoundary() {
  const error = useRouteError();

  // Handle specific API errors
  if (isRouteErrorResponse(error)) {
    if (error.status === 401) {
      return (
        <ErrorFallback
          heading="Authentication Required"
          message="Please log in to access your avatar."
          showAction
          actionText="Log In"
          actionTo="/login"
        />
      );
    }

    if (error.status === 404) {
      return (
        <ErrorFallback
          heading="Avatar Not Found"
          message="We couldn't find your avatar. Try refreshing the page."
          showAction
          actionText="Refresh"
          actionTo="."
        />
      );
    }
  }

  // Handle other errors
  return (
    <ErrorFallback
      heading="Avatar Error"
      message="There was a problem loading your avatar. Please try again later."
      showAction
      actionText="Retry"
      actionTo="."
    />
  );
}
