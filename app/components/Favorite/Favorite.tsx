import { ArrowDownRightIcon } from "lucide-react";
import { match } from "ts-pattern";
import { FavoriteImage, FavoriteImageProps } from "./FavoriteImage";
import { FavoriteText, FavoriteTextProps } from "./FavoriteText";

type FavoriteProps = FavoriteImageProps | FavoriteTextProps;
export const Favorite: React.FC<FavoriteProps> = ({ ...props }) => (
	<div className="px-6 py-4 overflow-y-hidden text-slate-900 h-[400px] w-1/3 -ml-[1px] -mt-[1px] border border-slate-400">
		<div className="flex flex-col h-full">
			<div className="text-xs mb-2">
				<h2>{props.title}</h2>
			</div>
			<div className="overflow-hidden mb-1">
				{match(props)
					.with({ type: "image" }, (favoriteImage) => (
						<FavoriteImage {...favoriteImage} />
					))
					.with({ type: "text" }, (favoriteText) => (
						<FavoriteText {...favoriteText} />
					))
					.otherwise(() => (
						<></>
					))}
			</div>
			<div>
				{props.references?.map(({ title, url }) => (
					<a className="text-xs flex hover:underline items-center" href={url}>
						<ArrowDownRightIcon className="h-5 w-5 mr-1" />
						<p>{title}</p>
					</a>
				))}
			</div>
		</div>
	</div>
);
