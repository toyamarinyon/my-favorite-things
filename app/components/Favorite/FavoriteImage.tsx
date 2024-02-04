import { FavoriteBaseProps } from "./type";

export type FavoriteImageProps = FavoriteBaseProps & {
	type: "image";
	imageUrl: string;
};
export const FavoriteImage: React.FC<FavoriteImageProps> = ({ imageUrl }) => (
	<img src={imageUrl} alt="the screenshot" className="w-full object-cover" />
);
