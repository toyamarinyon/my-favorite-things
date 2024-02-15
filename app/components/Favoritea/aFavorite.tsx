import { ArrowDownRightIcon } from "lucide-react";
import { match } from "ts-pattern";
import { formatDateTime } from "~/lib/formatter";
import { FavoriteImage, FavoriteImageProps } from "./favorite-image";
import { FavoriteText, FavoriteTextProps } from "./favorite-text";

type FavoriteProps = FavoriteImageProps | FavoriteTextProps;
export const Favorite: React.FC<FavoriteProps> = ({ ...props }) => (
	<div className="px-6 py-4 overflow-y-hidden text-slate-900 aspect-square w-1/3 xl:w-1/4 2xl:w-1/5 -ml-[1px] -mt-[1px] border border-slate-400">
		<div className="flex flex-col h-full">
			<div className="text-xs mb-2">
				<p className="text-ellipsis overflow-hidden whitespace-nowrap">
					{props.title}
				</p>
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
				{props.reference && (
					<a
						className="text-xs flex hover:underline items-center"
						href={props.reference.title}
					>
						<ArrowDownRightIcon className="h-5 w-5 mr-1 -ml-1 flex-shrink-0" />
						<p className="text-ellipsis overflow-hidden">
							{props.reference.title}
						</p>
					</a>
				)}
			</div>
			<div className="mt-auto flex justify-end">
				<p className="text-xs text-slate-700">
					Added: {formatDateTime(props.createdAt)}
				</p>
			</div>
		</div>
	</div>
);
