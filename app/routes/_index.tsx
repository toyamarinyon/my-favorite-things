import { Favorite } from "~/components/Favorite";
import { getAuth } from "@clerk/remix/ssr.server";
import { LoaderFunction, redirect } from "@remix-run/cloudflare";
import { MainLayout } from "~/components/layout/main";
import { findUserByClerkUserId } from "~/functions/users/findUser.server";

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args);
  if (!userId) {
    return redirect("/sign-in");
  }
  const user = await findUserByClerkUserId(userId, args.context);
  console.log(user);
  if (user == null) {
    return redirect("/onboarding");
  }
  return {};
};

export default function Index() {
  return (
    <MainLayout>
      <div className="divide-y divide-slate-400">
        <div className="flex flex-wrap ">
          <Favorite
            type="image"
            title="Relevence Onboarding UI"
            imageUrl="/images/1.jpeg"
          />
          <Favorite
            type="image"
            title="Fatih Akin at Death Stranding 2"
            imageUrl="/images/2.jpeg"
            references={[
              {
                title: "HIDEO_KOJIMA_EN on X",
                url: "https://twitter.com/HIDEO_KOJIMA_EN/status/1753687334347047107",
              },
            ]}
          />
          <Favorite
            title="スプラトゥーンがイカになった秘密"
            type="text"
            text="先に進めない状況のときに、阪口さんが、このゲームのキャラクターの
本来あるべき姿や機能などをまとめてくれたんです。
（中略）
その項目のひとつに「モチーフ」というのがあって、そこには
「インクを吐くことが納得いくモチーフ」という文章に続いて「イカ？」と書いてたんです。"
            references={[
              {
                title: "社長が訊く『Splatoon（スプラトゥーン）』",
                url: "https://www.nintendo.co.jp/wiiu/interview/agmj/vol1/index3.html",
              },
            ]}
          />
          <Favorite
            type="image"
            title="Y2K REMIXされたデザイン"
            imageUrl="/images/3.jpeg"
            references={[
              {
                title: "Poolsuite™",
                url: "https://poolsuite.net/",
              },
            ]}
          />
          <Favorite
            type="image"
            title="Minimalist Portfolio"
            imageUrl="/images/4.png"
            references={[
              {
                title: "Chris Yang",
                url: "https://ysm.dev/",
              },
            ]}
          />
          <Favorite
            type="image"
            title="Beautiful Flowchart"
            imageUrl="/images/5.png"
            references={[
              {
                title: "DanHollick on X",
                url: "https://twitter.com/DanHollick/status/1614970789199220738",
              },
            ]}
          />
        </div>
      </div>
    </MainLayout>
  );
}
