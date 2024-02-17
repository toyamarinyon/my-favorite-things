import { ActionFunctionArgs, json, redirect } from "@remix-run/cloudflare";
import { Form, useFetcher, useNavigation } from "@remix-run/react";
import clsx from "clsx";
import "cropperjs/dist/cropper.css";
import { SparkleIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import { match } from "ts-pattern";
import { ValiError, flatten, parse } from "valibot";
import { Favorite } from "~/components/favorite";
import { FileInput } from "~/components/favorite/file-input";
import { MainLayout } from "~/components/layout/main";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Textarea } from "~/components/ui/textarea";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip";
import { BodyType, BodyTypeSchema } from "~/db/favorites";
import { createFavorite } from "~/functions/favorites/createFavorite.server";
import { useFormData } from "~/lib/useFormData";
import type { action as analyzeImageAction } from "~/routes/analyzeImage";

type SelectImage = {
	step: "select-image";
};
type EnterDetails = {
	step: "enter-details";
	imageUrl: string;
};
type AddNewFavoriteFlow = SelectImage | EnterDetails;

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
	const [cropped400WidthBase64Url, setCropped400WidthBase64Url] = useState<
		string | null
	>(null);
	const [cropped800WidthBase64Url, setCropped800WidthBase64Url] = useState<
		string | null
	>(null);
	const handleCrop = () => {
		const cropper = cropperRef.current?.cropper;
		if (cropper == null) {
			return;
		}
		setCropped400WidthBase64Url(
			cropper
				.getCroppedCanvas({ width: 400, height: 300 })
				.toDataURL("image/jpeg", 0.8),
		);
		setCropped800WidthBase64Url(
			cropper
				.getCroppedCanvas({
					maxWidth: 800,
					maxHeight: 600,
					imageSmoothingEnabled: true,
					imageSmoothingQuality: "high",
				})
				.toDataURL("image/jpeg", 0.8),
		);
	};
	return {
		cropperRef,
		cropped400WidthBase64Url,
		cropped800WidthBase64Url,
		handleCrop,
	};
};

export default function FavoriteNewPage() {
	const {
		cropperRef,
		handleCrop,
		cropped400WidthBase64Url,
		cropped800WidthBase64Url,
	} = useCropper();
	const [flow, setFlow] = useState<AddNewFavoriteFlow>({
		step: "select-image",
	});
	const handleFileChange = useCallback((file: File) => {
		const objectUrl = URL.createObjectURL(file);
		setFlow({
			step: "enter-details",
			imageUrl: objectUrl,
		});
	}, []);
	const analyzeImage = useFetcher<typeof analyzeImageAction>();
	const handleClickAnalyzeButton = useCallback(() => {
		if (cropped400WidthBase64Url == null) {
			/** @todo show error toast */
			return;
		}
		const formData = new FormData();
		formData.append("imageUrl", cropped400WidthBase64Url);
		analyzeImage.submit(formData, { method: "POST", action: "/analyzeImage" });
	}, [analyzeImage, cropped400WidthBase64Url]);
	const titleRef = useRef<HTMLInputElement>(null);
	const { formRef, formData, updateFormData } = useFormData();
	useEffect(() => {
		if (titleRef.current == null || analyzeImage.data?.analyze == null) {
			return;
		}
		titleRef.current.value = analyzeImage.data.analyze;
		updateFormData();
	}, [analyzeImage.data, titleRef]);
	const navigation = useNavigation();
	const [favoriteType, setFavoriteType] = useState<BodyType>("image");
	const handleFavoriteTypeChange = useCallback((newFavoriteType: string) => {
		parse(BodyTypeSchema, newFavoriteType);
		setFavoriteType(parse(BodyTypeSchema, newFavoriteType));
	}, []);
	return (
		<MainLayout>
			<div className="p-4 font-thin">
				<h1 className="text-lg mb-4">Add a new favorite</h1>
				<Form method="post" ref={formRef}>
					<div className="flex pl-8 space-x-8">
						<ol className="list-decimal space-y-6">
							<li>
								<p className="mb-2">Chose the type you want to add</p>
								<div className="flex">
									<div>
										<RadioGroup
											value={favoriteType}
											onValueChange={handleFavoriteTypeChange}
										>
											<div className="flex items-center space-x-2">
												<RadioGroupItem value="image" id="image" />
												<Label htmlFor="image">Image</Label>
											</div>
											<div className="flex items-center space-x-2">
												<RadioGroupItem value="text" id="text" />
												<Label htmlFor="text">Text</Label>
											</div>
										</RadioGroup>
									</div>
								</div>
							</li>

							{match(favoriteType)
								.with("image", () => (
									<>
										<li>
											<p className="mb-2">
												Click the "Select a file" button to select a file
											</p>
											<FileInput onFileChange={handleFileChange} />
										</li>
										{match(flow)
											.with({ step: "enter-details" }, ({ imageUrl }) => (
												<li>
													<p className="mb-2">
														Crop the uploaded image and enter the details
													</p>
													<div className="mb-4">
														<div className="w-[500px]">
															<Cropper
																src={imageUrl}
																style={{ width: "100%" }}
																viewMode={1}
																// Cropper.js options
																initialAspectRatio={4 / 3}
																aspectRatio={4 / 3}
																guides={false}
																background={false}
																ready={handleCrop}
																cropend={handleCrop}
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
																ref={titleRef}
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
																				<p className="sono text-xs">
																					Analyzing...
																				</p>
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
													{cropped800WidthBase64Url != null && (
														<input
															name="dataUrl"
															value={cropped800WidthBase64Url}
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
															URL of the image reference (web page, book
															introduction page, etc.)
														</p>
													</div>
													<input type="hidden" name="bodyType" value="image" />
													<Button
														type="submit"
														progress={navigation.state === "submitting"}
													>
														Add fav
													</Button>
												</li>
											))
											.otherwise(() => (
												<></>
											))}
									</>
								))
								.with("text", () => (
									<>
										<div>
											<p>2. Enter the details</p>
											<div className="mb-4 space-y-3">
												<div>
													<Label htmlFor="body">Content</Label>
													<Textarea
														id="body"
														name="body"
														placeholder="If I had an hour to solve a problem I'd spend 55 minutes thinking about the problem and 5 minutes thinking about solutions."
													/>
												</div>
												<div>
													<Label htmlFor="title">Title</Label>
													<Input
														type="text"
														id="title"
														name="title"
														placeholder="Albert Einstein - Problem Solving"
													/>
												</div>
												<div>
													<Label htmlFor="referenceUrl">URL</Label>
													<Input
														type="text"
														id="referenceUrl"
														name="referenceUrl"
														placeholder="https://www.goodreads.com/quotes/60780-if-i-had-an-hour-to-solve-a-problem-i-d"
													/>
													<p className="text-xs">
														URL of the image reference (web page, book
														introduction page, etc.)
													</p>
												</div>
											</div>
											<Button
												type="submit"
												progress={navigation.state === "submitting"}
											>
												Add fav
											</Button>
										</div>
									</>
								))
								.exhaustive()}
						</ol>
						<div className="relative">
							<div className="sticky top-0 pt-4">
								<Favorite
									variant={"fixWidth"}
									className="w-[300px]"
									type="image"
									title={formData.title || "Title"}
									imageUrl={cropped800WidthBase64Url ?? ""}
									createdAt={new Date().toUTCString()}
									preview
								/>
							</div>
						</div>
					</div>
				</Form>
			</div>
		</MainLayout>
	);
}
