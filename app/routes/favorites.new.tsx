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
import { LoaderFunctionArgs, json } from "@remix-run/cloudflare";
import { useFetcher } from "@remix-run/react";

type SelectImage = {
  step: "select-image";
};
type EnterDetails = {
  step: "enter-details";
  imageUrl: string;
};
type AddNewFavoriteFlow = SelectImage | EnterDetails;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export async function loader({}: LoaderFunctionArgs) {
  await sleep(3000);
  return json({ analyzeResult: "Hello, world!" });
}

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
    // step: "select-image",
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
  const analyzeImage = useFetcher<typeof loader>();
  const handleClickAnalyzeButton = useCallback(() => {
    analyzeImage.load("/favorites/new");
  }, [analyzeImage]);
  return (
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
                <p>Crop the uploaded image and enter the details</p>
                {flow.step === "enter-details" && (
                  <>
                    <div className="mb-8 space-y-1">
                      <div>
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
                                  onClick={handleClickAnalyzeButton}
                                >
                                  {analyzeImage.state === "loading" && (
                                    <p className="sono text-xs">Analyzing...</p>
                                  )}
                                  <SparkleIcon
                                    className={clsx("h-4 w-4", {
                                      "animate-spin":
                                        analyzeImage.state === "loading",
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
                      <div>
                        <Label htmlFor="reference">URL</Label>
                        <Input type="text" id="reference" name="reference" />
                        <p className="text-xs">
                          URL of the image reference (web page, book
                          introduction page, etc.)
                        </p>
                      </div>
                    </div>
                    <Button type="button" onClick={handleClickSelectFileButton}>
                      Finish
                    </Button>
                  </>
                )}
              </div>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
