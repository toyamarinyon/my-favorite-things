import { ChangeEventHandler, useCallback, useRef } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

type FileInputProps = {
	onFileChange: (file: File | Blob) => void;
};
export const FileInput: React.FC<FileInputProps> = ({ onFileChange }) => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const handleClickSelectFileButton = useCallback(
		() => fileInputRef.current?.click(),
		[],
	);
	const handleClickPasteFromClipboardButton = useCallback(async () => {
		const clipboardItems = await navigator.clipboard.read();
		for (const clipboardItem of clipboardItems) {
			const imageType = clipboardItem.types.find((type) =>
				type.startsWith("image/"),
			);
			if (imageType == null) {
				continue;
			}
			const blob = await clipboardItem.getType(imageType);
			onFileChange(blob);
		}
	}, [onFileChange]);
	const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
		(e) => {
			if (e.target.files == null) {
				return;
			}
			onFileChange(e.target.files[0]);
			e.target.value = "";
		},
		[onFileChange],
	);
	return (
		<div className="space-y-2">
			<div>
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
			</div>
			<p>or</p>
			<Button type="button" onClick={handleClickPasteFromClipboardButton}>
				Paste from clipboard
			</Button>
		</div>
	);
};
