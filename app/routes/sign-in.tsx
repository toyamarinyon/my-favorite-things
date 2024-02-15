import { SignIn } from "@clerk/remix";
import { HeartIcon } from "lucide-react";
import { Typewriter } from "~/components/ui/typewriter";

export default function AuthLayout() {
	return (
		<div className="flex h-screen divide-x divide-slate-900">
			<div className="flex-1 relative">
				<div className="absolute flex h-14 items-center px-4">
					<div className="flex items-center">
						<p className="sono mr-1 text-lg">My Favorites</p>
						<HeartIcon className="h-4 w-4 fill-slate-800 text-slate-800" />
					</div>
				</div>
				<div className="px-4 flex items-center h-full">
					<Typewriter
						text="Keep your cherished memories all in one place.

          With My Favorites, you can easily save your favorite photos, artwork, and writings. Capture memorable moments with photos, upload your original poems and texts, and collect your special creations in one spot.

          You can add titles and descriptions to your favorite works, helping you remember the stories behind them. If you have trouble coming up with words, our AI can suggest appropriate titles and descriptions.

          The memories you gather on My Favorites can be organized and searched by date and tags. Revisit your own special mementos anytime.

          My Favorites is a service recommended for those who cherish memories. Please feel free to use My Favorites."
					/>
				</div>
			</div>
			<div className="flex-1 flex items-center">
				<SignIn />
			</div>
		</div>
	);
}
