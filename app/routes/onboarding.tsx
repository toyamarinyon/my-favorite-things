import { ActionFunctionArgs, json, redirect } from "@remix-run/cloudflare";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { ValiError, flatten } from "valibot";
import { MainLayout } from "~/components/layout/main";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { createUser } from "~/functions/users/createUser.server";

// type ActionInputError = Record<string, string[]>
export const action = async (args: ActionFunctionArgs) => {
  try {
    await createUser(args);
  } catch (e) {
    if (e instanceof ValiError) {
      return json({ errors: flatten(e) }, { status: 400 });
    }
    throw new Error("An error occurred while creating the user");
  }
  return redirect("/");
};

export default function OnboadingPage() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = Boolean(navigation.state === "submitting");
  return (
    <MainLayout actions={false}>
      <div className="px-4">
        <Form method="post" className="w-[500px]">
          <h1 className="text-lg">Please tell me your username</h1>
          <fieldset disabled={isSubmitting}>
            <div className="mb-2">
              <Label htmlFor="username">Username</Label>
              <Input
                type="text"
                id="username"
                name="username"
                className="w-[200px]"
              />
              {actionData?.errors?.nested?.username && (
                <div className="mt-1">
                  <span className="bg-red-600 leading-none text-white font-medium text-xs">
                    {actionData.errors.nested.username}
                  </span>
                </div>
              )}
            </div>
            <Button type="submit" progress={isSubmitting}>
              Continue
            </Button>
          </fieldset>
        </Form>
      </div>
    </MainLayout>
  );
}
