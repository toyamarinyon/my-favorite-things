import { ActionFunctionArgs, json, redirect } from "@remix-run/cloudflare";
import { Form, useFetcher } from "@remix-run/react";
import clsx from "clsx";
import "cropperjs/dist/cropper.css";
import { SparkleIcon } from "lucide-react";
import {
	startTransition,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import { ValiError, flatten } from "valibot";
import { FileInput } from "~/components/Favorite/file-input";
import { MainLayout } from "~/components/layout/main";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip";
import { createFavorite } from "~/functions/favorites/createFavorite.server";
import type { action as analyzeImageAction } from "~/routes/analyzeImage";

type SelectImage = {
	step: "select-image";
};
type EnterDetails = {
	step: "enter-details";
	imageUrl: string;
};
type AddNewFavoriteFlow = SelectImage | EnterDetails;

export async function loader() {
	return json({});
}

export async function action(args: ActionFunctionArgs) {
	try {
		await createFavorite(args);
		return redirect("/");
	} catch (e) {
		if (e instanceof ValiError) {
			return json({ error: flatten(e) }, { status: 400 });
		}
		console.error(e);
		throw new Error("unexpected error");
	}
}

const useCropper = () => {
	const cropperRef = useRef<ReactCropperElement>(null);
	const [croppedCanvas, setCroppedCanvas] = useState<HTMLCanvasElement | null>(
		null,
	);
	const handleCrop = () => {
		const cropper = cropperRef.current?.cropper;
		if (cropper == null) {
			return;
		}
		startTransition(() => {
			setCroppedCanvas(cropper.getCroppedCanvas());
		});
	};
	return {
		cropperRef,
		croppedCanvas,
		handleCrop,
	};
};

export default function FavoriteNewPage() {
	const { cropperRef, handleCrop, croppedCanvas } = useCropper();
	const [flow, setFlow] = useState<AddNewFavoriteFlow>({
		step: "select-image",
		// step: "enter-details",
		// imageUrl: "https://100r.co/media/content/projects/dotgrid_02.jpg",
	});
	const handleFileChange = useCallback((file: File) => {
		setFlow({
			step: "enter-details",
			imageUrl: URL.createObjectURL(file),
		});
	}, []);
	const analyzeImage = useFetcher<typeof analyzeImageAction>();
	const handleClickAnalyzeButton = useCallback(() => {
		if (croppedCanvas == null) {
			/** @todo show error toast */
			return;
		}

		const formData = new FormData();
		formData.append("imageUrl", croppedCanvas.toDataURL());
		analyzeImage.submit(formData, { method: "POST", action: "/analyzeImage" });
	}, [analyzeImage, croppedCanvas]);
	const inputRef = useRef<HTMLInputElement>(null);
	useEffect(() => {
		if (analyzeImage.data?.analyze == null || inputRef.current == null) {
			return;
		}
		inputRef.current.value = analyzeImage.data.analyze;
	}, [analyzeImage.data]);
	return (
		<MainLayout>
			<div className="p-4 font-thin">
				<h1 className="text-lg">Add a new favorite</h1>
				<div className="flex divide-x divide-slate-900">
					<div className="pr-4">
						<ol className="ml-6 list-decimal pt-2">
							<li
								className={clsx({
									"line-through": flow.step === "enter-details",
								})}
							>
								<div className="h-16 space-y-0.5">
									<p>Click the "Select a file" button to select a file</p>
									{flow.step === "select-image" && (
										<FileInput onFileChange={handleFileChange} />
									)}
								</div>
							</li>
							<li>
								<p>Crop the uploaded image and enter the details</p>
								{flow.step === "enter-details" && (
									<Form method="post">
										<div className="mb-8 space-y-1">
											<div className="w-[500px]">
												<Cropper
													src={flow.imageUrl}
													style={{ width: "100%" }}
													viewMode={1}
													// Cropper.js options
													initialAspectRatio={4 / 3}
													aspectRatio={4 / 3}
													guides={false}
													background={false}
													crop={handleCrop}
													ref={cropperRef}
													zoomable={false}
												/>
											</div>
										</div>

										<div>
											<Label htmlFor="title">Title</Label>
											<div className="flex items-center space-x-1">
												<Input
													type="text"
													id="title"
													name="title"
													ref={inputRef}
												/>
												<TooltipProvider>
													<Tooltip>
														<TooltipTrigger asChild>
															<Button
																type="button"
																size="form"
																onClick={handleClickAnalyzeButton}
															>
																{analyzeImage.state === "submitting" && (
																	<p className="sono text-xs">Analyzing...</p>
																)}
																<SparkleIcon
																	className={clsx("h-4 w-4", {
																		"animate-spin":
																			analyzeImage.state === "submitting",
																	})}
																/>
															</Button>
														</TooltipTrigger>
														<TooltipContent>
															<p>Analyze images with AI</p>
														</TooltipContent>
													</Tooltip>
												</TooltipProvider>
											</div>
										</div>
										{croppedCanvas != null && (
											<input
												name="dataUrl"
												value={croppedCanvas.toDataURL()}
												type="hidden"
											/>
										)}
										<div className="mb-2">
											<Label htmlFor="referenceUrl">URL</Label>
											<Input
												type="text"
												id="referenceUrl"
												name="referenceUrl"
											/>
											<p className="text-xs">
												URL of the image reference (web page, book introduction
												page, etc.)
											</p>
										</div>
										<Button type="submit">Add fav</Button>
									</Form>
								)}
							</li>
						</ol>
					</div>
				</div>
			</div>
		</MainLayout>
	);
}
