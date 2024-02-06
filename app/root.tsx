import {
	ClerkApp,
	ClerkErrorBoundary,
	SignedIn,
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
				<SignedIn>
					<main>
						<div className="relative">
							<div className="flex items-center px-4 h-14">
								<div className="flex items-center">
									<p className="sono text-lg mr-1">My Favorite Things</p>
									<HeartIcon className="h-4 w-4 text-slate-800 fill-slate-800" />
								</div>
								<div className="ml-auto flex items-center space-x-4">
									<Button type="button">+ Add fav</Button>
									<span>/</span>
									<UserButton />
								</div>
							</div>
						</div>
					</main>
				</SignedIn>
				<Outlet />
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}

export default ClerkApp(App);
