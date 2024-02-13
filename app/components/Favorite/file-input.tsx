import { ChangeEventHandler, useCallback, useRef } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

type FileInputProps = {
	onFileChange: (file: File) => void;
};
export const FileInput: React.FC<FileInputProps> = ({ onFileChange }) => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const handleClickSelectFileButton = useCallback(
		() => fileInputRef.current?.click(),
		[],
	);
	const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
		(e) => {
			if (e.target.files == null) {
				return;
			}
			onFileChange(e.target.files[0]);
		},
		[onFileChange],
	);
	return (
		<>
			<Button type="button" onClick={handleClickSelectFileButton}>
				Select a file
			</Button>
			<Input
				name="file"
				id="file"
				type="file"
				onChange={handleChange}
				ref={fileInputRef}
				className="hidden"
			/>
		</>
	);
};
