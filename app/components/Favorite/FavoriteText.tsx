import { FavoriteBaseProps } from "./type";

export type FavoriteTextProps = FavoriteBaseProps & {
	type: "text";
	text: string;
};
export const FavoriteText: React.FC<FavoriteTextProps> = ({ text }) => (
	<div>
		<div className="border-l-2 pl-4 border-slate-500 mb-2">
			<p>{text}</p>
		</div>
	</div>
);
