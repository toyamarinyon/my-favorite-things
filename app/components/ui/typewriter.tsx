import { animate, motion, motionValue, useTransform } from "framer-motion";
import { useCallback, useEffect } from "react";

const blinkVariant = {
	blinking: {
		opacity: [0, 0, 1, 1],
		transition: {
			duration: 1,
			repeat: Infinity,
			repeatDelay: 0,
			ease: "linear",
			times: [0, 0.5, 0.5, 1],
		},
	},
};

export const Typewriter: React.FC<{ text: string }> = ({ text }) => {
	const showLettersLength = motionValue(0);
	const showLetters = useTransform(showLettersLength, (value) =>
		text.slice(0, value),
	);
	const typing = useCallback(() => {
		animate(showLettersLength, text.length, {
			duration: text.length * 0.1,
			ease: "linear",
		});
	}, [text.length, showLettersLength]);
	useEffect(() => {
		typing();
	}, [typing]);
	return (
		<div>
			<motion.span className="sono leading-8">{showLetters}</motion.span>
			<motion.span
				variants={blinkVariant}
				animate="blinking"
				className="ml-2 inline-block h-5 w-[1px] translate-y-1 bg-slate-900"
			/>
		</div>
	);
};
