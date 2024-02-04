type Reference = {
	url: string;
	title: string;
};
export type FavoriteBaseProps = {
	type: string;
	title: string;
	references?: Reference[];
};
