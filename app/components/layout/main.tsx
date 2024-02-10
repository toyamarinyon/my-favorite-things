import { UserButton } from "@clerk/remix";
import { HeartIcon } from "lucide-react";
import { PropsWithChildren } from "react";
import { Button } from "~/components/ui/button";

export const MainLayout: React.FC<PropsWithChildren> = ({ children }) => (
  <div>
    <header>
      <div className="flex h-14 items-center px-4">
        <div className="flex items-center">
          <p className="sono mr-1 text-lg">My Favorite Things</p>
          <HeartIcon className="h-4 w-4 fill-slate-800 text-slate-800" />
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <Button type="button">+ Add fav</Button>
          <span>/</span>
          <UserButton />
        </div>
      </div>
    </header>
    <main>{children}</main>
  </div>
);
