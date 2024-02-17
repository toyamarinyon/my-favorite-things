import { useCallback, useEffect, useRef, useState } from "react";

export const useFormData = () => {
	const formRef = useRef<HTMLFormElement>(null);
	const [formData, setFormData] = useState<Record<string, string>>({});
	const updateFormData = useCallback(() => {
		if (formRef.current == null) {
			return;
		}
		const newFormData = new FormData(formRef.current);
		setFormData(
			Object.fromEntries(newFormData.entries()) as Record<string, string>,
		);
	}, [formRef]);
	useEffect(() => {
		if (formRef.current == null) {
			return;
		}
		formRef.current?.addEventListener("change", updateFormData);
		return () => {
			formRef.current?.removeEventListener("change", updateFormData);
		};
	}, [formRef]);

	return {
		formRef,
		formData,
		updateFormData,
	};
};
