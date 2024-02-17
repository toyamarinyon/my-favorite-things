import { VariantProps, cva } from "class-variance-authority";
import { ArrowDownRightIcon, ImageIcon } from "lucide-react";
import { match } from "ts-pattern";
import { formatDateTime } from "~/lib/formatter";
import { cn } from "~/lib/utils";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/tooltip";
import { FavoriteImage, FavoriteImageProps } from "./favorite-image";
import { FavoriteText, FavoriteTextProps } from "./favorite-text";

type FavoriteProps = FavoriteImageProps | FavoriteTextProps;
const favoriteVariants = cva(
	"relative px-6 py-4 text-slate-900 aspect-square -ml-[1px] -mt-[1px] border border-slate-900",
	{
		variants: {
			variant: {
				default: "w-1/3 xl:w-1/4 2xl:w-1/5",
				fixWidth: "",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);
type Reference = {
	url: string;
	title: string;
};
type FavoriteGlance = {
	title: string;
	reference?: Reference | null;
	createdAt: string;
	preview?: boolean;
};
interface FavoriteVariants
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof favoriteVariants> {}
export const Favorite: React.FC<
	FavoriteGlance & FavoriteProps & FavoriteVariants
> = ({ className, variant, title, reference, preview = false, ...props }) => (
	<div className={cn(favoriteVariants({ variant, className }))}>
		{preview && (
			<div
				className="absolute -top-[1px] -left-[20px] bg-slate-900 text-slate-50 text-xs font-medium py-2 px-0.5"
				style={{ writingMode: "vertical-lr" }}
			>
				PREVIEW
			</div>
		)}
		<div className="flex flex-col h-full">
			<div className="text-xs mb-2">
				<p className="text-ellipsis overflow-hidden whitespace-nowrap">
					{preview ? (
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger>{title}</TooltipTrigger>
								<TooltipContent asChild>
									<span>Enter the title after selecting an image</span>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					) : (
						title
					)}
				</p>
			</div>
			<div className="overflow-hidden mb-1">
				{match(props)
					.with({ type: "image" }, (favoriteImage) =>
						favoriteImage.imageUrl === "" && preview ? (
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<div className="w-full flex items-center justify-center aspect-[4/3] border border-slate-900">
											<ImageIcon className="w-40 h-40" strokeWidth={0.1} />
										</div>
									</TooltipTrigger>
									<TooltipContent>
										Click the "Select a file" button to select a file
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						) : (
							<FavoriteImage {...favoriteImage} />
						),
					)
					.with({ type: "text" }, (favoriteText) => (
						<FavoriteText {...favoriteText} />
					))
					.otherwise(() => (
						<></>
					))}
			</div>
			<div>
				{reference &&
					(preview ? (
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger>
									<span className="text-xs flex hover:underline items-center">
										<ArrowDownRightIcon className="h-5 w-5 mr-1 -ml-1 flex-shrink-0" />
										<p className="text-ellipsis overflow-hidden">
											{reference.title}
										</p>
									</span>
								</TooltipTrigger>
								<TooltipContent asChild>
									<span>Enter the URL after selecting an image</span>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					) : (
						<a
							className="text-xs flex hover:underline items-center"
							href={reference.title}
						>
							<ArrowDownRightIcon className="h-5 w-5 mr-1 -ml-1 flex-shrink-0" />
							<p className="text-ellipsis overflow-hidden">{reference.title}</p>
						</a>
					))}
			</div>
			<div className="mt-auto flex justify-end">
				<p className="text-xs text-slate-700">
					Added: {formatDateTime(props.createdAt)}
				</p>
			</div>
		</div>
	</div>
);
