import { UserButton, useAuth } from "@clerk/remix";
import { SignInButton } from "@clerk/remix";
import { Link } from "@remix-run/react";
import { HeartIcon } from "lucide-react";
import { PropsWithChildren } from "react";
import { Button } from "~/components/ui/button";

type MainLayoutProps = { username?: string };
export const MainLayout: React.FC<PropsWithChildren<MainLayoutProps>> = ({
	children,
	username,
}) => {
	const { isLoaded, userId } = useAuth();
	if (!isLoaded) {
		return;
	}
	return (
		<div>
			<header>
				<div className="flex h-14 items-center px-4">
					<div className="flex items-center">
						<p className="sono mr-1 text-lg">
							{username == null ? "My" : `${username}'s`} favorites
						</p>
						<HeartIcon className="h-4 w-4 fill-slate-800 text-slate-800" />
					</div>
					<div className="ml-auto flex items-center space-x-2">
						{userId == null ? (
							<>
								<Link to="/">
									<Button>Create your favorites</Button>
								</Link>
								<SignInButton mode="modal">
									<Button variant={"link"}>Login</Button>
								</SignInButton>
							</>
						) : (
							<>
								<Link to="/favorites/new">
									<Button type="button">+ Add fav</Button>
								</Link>
								<span className="pb-1">/</span>
								<UserButton />
							</>
						)}
					</div>
				</div>
			</header>
			<main>{children}</main>
		</div>
	);
};
