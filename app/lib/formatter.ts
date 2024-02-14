const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
	year: "numeric",
	month: "short",
	day: "numeric",
	hour: "numeric",
	minute: "numeric",
	hour12: false,
	timeZone: "Asia/Tokyo",
	timeZoneName: "shortOffset",
});

export const formatDateTime = (date: string) => {
	const utcDate = new Date(date);
	utcDate.setTime(utcDate.getTime() - utcDate.getTimezoneOffset() * 60 * 1000);
	return dateTimeFormatter.format(utcDate);
};
