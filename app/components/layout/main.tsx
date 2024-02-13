import { UserButton } from "@clerk/remix";
import { Link } from "@remix-run/react";
import { HeartIcon } from "lucide-react";
import { PropsWithChildren } from "react";
import { Button } from "~/components/ui/button";

type MainLayoutProps = {
	actions?: boolean;
};
export const MainLayout: React.FC<PropsWithChildren<MainLayoutProps>> = ({
	children,
	actions = true,
}) => (
	<div>
		<header>
			<div className="flex h-14 items-center px-4">
				<div className="flex items-center">
					<p className="sono mr-1 text-lg">My favorites space</p>
					<HeartIcon className="h-4 w-4 fill-slate-800 text-slate-800" />
				</div>
				{actions && (
					<div className="ml-auto flex items-center space-x-4">
						<Link to="/favorites/new">
							<Button type="button">+ Add fav</Button>
						</Link>
						<span className="pb-1">/</span>
						<UserButton />
					</div>
				)}
			</div>
		</header>
		<main>{children}</main>
	</div>
);
