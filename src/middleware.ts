import {clerkMiddleware, createRouteMatcher} from "@clerk/nextjs/server";

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)/((?!inngest).*)'],
};

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});
