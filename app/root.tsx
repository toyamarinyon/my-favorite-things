import {
  ClerkApp,
  ClerkErrorBoundary,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/remix";
import { rootAuthLoader } from "@clerk/remix/ssr.server";
import type { LinksFunction, LoaderFunction } from "@remix-run/cloudflare";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import stylesheet from "~/globals.css";
import { Button } from "./components/ui/button";
import { HeartIcon } from "lucide-react";
import { cssBundleHref } from "@remix-run/css-bundle";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100;400;700&family=Sono:wght@200&display=swap",
  },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader: LoaderFunction = (args) => rootAuthLoader(args);

export const ErrorBoundary = ClerkErrorBoundary();

function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default ClerkApp(App, {
  appearance: {
    variables: {
      colorPrimary: "hsl(222.2 47.4% 11.2%)",
      borderRadius: "0",
    },
    signIn: {
      elements: {
        card: "shadow-none border ",
        formButtonPrimary: "bg-primary font-thin",
        headerTitle: "font-thin",
        headerSubtitle: "font-thin",
        formFieldLabel: "font-thin",
      },
    },
  },
});
