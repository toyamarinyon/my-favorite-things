import { ChangeEventHandler, useCallback, useRef, useState } from "react";
import { Input } from "~/components/ui/input";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Button } from "~/components/ui/button";
import clsx from "clsx";
import { Label } from "~/components/ui/label";
import { SparkleIcon } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip";

type SelectImage = {
	step: "select-image";
};
type EnterDetails = {
	step: "enter-details";
	imageUrl: string;
};
type AddNewFavoriteFlow = SelectImage | EnterDetails;

export default function FavoriteNewPage() {
	const cropperRef = useRef<ReactCropperElement>(null);
	const onCrop = () => {
		const cropper = cropperRef.current?.cropper;
		if (cropper == null) {
			return;
		}
		// console.log(cropper.getCroppedCanvas().toDataURL());
	};
	const fileInputRef = useRef<HTMLInputElement>(null);
	const handleClickSelectFileButton = useCallback(() => {
		fileInputRef.current?.click();
	}, []);
	const [flow, setFlow] = useState<AddNewFavoriteFlow>({
		step: "enter-details",
		imageUrl: "https://100r.co/media/content/projects/dotgrid_02.jpg",
	});
	const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
		(e) => {
			if (e.target.files == null) {
				return;
			}
			setFlow({
				step: "enter-details",
				imageUrl: URL.createObjectURL(e.target.files[0]),
			});
		},
		[],
	);
	const [generating, setGenerating] = useState(false);
	return (
		<div className="p-4 font-thin">
			<h1 className="text-lg">Add a new favorite</h1>
			<div className="flex divide-x divide-slate-900">
				<div className="pr-4">
					<ol className="list-decimal ml-6 pt-2">
						<li
							className={clsx({
								"line-through": flow.step === "enter-details",
							})}
						>
							<div className="space-y-0.5 h-16">
								<p>Click the "Select a file" button to select a file</p>
								{flow.step === "select-image" && (
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
								)}
							</div>
						</li>
						<li>
							<div>
								<p>Enter the details</p>
								{flow.step === "enter-details" && (
									<div className="space-y-1">
										<div>
											<p>Crop the uploaded image</p>
											<div className="w-[400px]">
												<Cropper
													src={flow.imageUrl}
													style={{ width: "100%" }}
													viewMode={1}
													// Cropper.js options
													initialAspectRatio={1 / 1}
													aspectRatio={1 / 1}
													guides={false}
													background={false}
													crop={onCrop}
													ref={cropperRef}
													zoomable={false}
												/>
											</div>
										</div>
										<div>
											<Label htmlFor="title">Title</Label>
											<div className="flex items-center space-x-1">
												<Input type="text" id="title" name="title" />
												<TooltipProvider>
													<Tooltip>
														<TooltipTrigger>
															<Button
																size="form"
																onClick={() => {
																	setGenerating(true);
																}}
															>
																{generating && (
																	<p className="text-xs sono">Analyzing...</p>
																)}
																<SparkleIcon className="w-4 h-4" />
															</Button>
														</TooltipTrigger>
														<TooltipContent>
															<p>Analyze images with AI</p>
														</TooltipContent>
													</Tooltip>
												</TooltipProvider>
											</div>
										</div>
										<Button type="button" onClick={handleClickSelectFileButton}>
											Finish
										</Button>
									</div>
								)}
							</div>
						</li>
					</ol>
				</div>
			</div>
		</div>
	);
}
