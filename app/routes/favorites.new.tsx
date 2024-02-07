import {
  ChangeEventHandler,
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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
import { ActionFunctionArgs, json } from "@remix-run/cloudflare";
import { Form, useFetcher } from "@remix-run/react";
import { parse, picklist } from "valibot";
import { match } from "ts-pattern";
import { analyzeImage } from "~/functions/analyzeImage.server";

const ActionType = ["analyze-image", "create-favorite"] as const;
const actionTypeSchema = picklist(ActionType);

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
  const formData = await args.request.clone().formData();
  const unsafeActionType = formData.get("actionType");
  const actionType = parse(actionTypeSchema, unsafeActionType);
  return match(actionType)
    .with("analyze-image", async () => await analyzeImage(args))
    .with("create-favorite", () => analyzeImage(args))
    .exhaustive();
}

export default function FavoriteNewPage() {
  const cropperRef = useRef<ReactCropperElement>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const onCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper == null) {
      return;
    }
    startTransition(() => {
      setCanvas(cropper.getCroppedCanvas());
    });
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
  const analyzeImage = useFetcher<typeof action>();
  const handleClickAnalyzeButton = useCallback(() => {
    const formData = new FormData();

    formData.append("imageUrl", canvas == null ? "" : canvas.toDataURL());
    formData.append("actionType", "analyze-image");
    analyzeImage.submit(formData, { method: "POST" });
  }, [analyzeImage, canvas]);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (analyzeImage.data?.analyzeResult == null || inputRef.current == null) {
      return;
    }
    inputRef.current.value = analyzeImage.data.analyzeResult;
  }, [analyzeImage.data]);
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
                  {canvas != null && (
                    <input value={canvas.toDataURL()} type="hidden" />
                  )}
                  <div>
                    <Label htmlFor="reference">URL</Label>
                    <Input type="text" id="reference" name="reference" />
                    <p className="text-xs">
                      URL of the image reference (web page, book introduction
                      page, etc.)
                    </p>
                  </div>
                  <Button type="submit">Finish</Button>
                  <input
                    type="hidden"
                    name="actionType"
                    value="create-favorite"
                  />
                </Form>
              )}
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
