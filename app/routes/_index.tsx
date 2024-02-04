import {
	RedirectToSignIn,
	SignedIn,
	SignedOut,
	UserButton,
} from "@clerk/remix";
import { Favorite } from "~/components/Favorite";

export default function Index() {
	return (
		<div>
			<SignedIn>
				<main>
					<div className="relative">
						<div className="absolute w-screen align-center inset-0 flex items-center justify-center">
							<p className="sono text-lg">My Favorite Things</p>
						</div>
						<div className="flex items-center px-4 h-14">
							<div />
							<div className="ml-auto">
								<UserButton showName />
							</div>
						</div>
					</div>
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
					{/* <div className="px-4">
						<article className="border border-slate-400 w-[300px] divide-y divide-slate-400">
							<div>
								<img src="/images/1.jpeg" />
							</div>
							<section className="px-2 text-sm">
								<p>20240202</p>
							</section>
							<section className="px-2 py-0.5 h-24 overflow-scroll">
								<p className="text-slate-400 text-sm">
									The image is a screenshot of a graphical user interface for an
									application. It includes text fields for entering first name,
									last name, company name, and how the user found the
									application. There is also a "Continue" button present. The
									design features a font that is clear and easy to read.
								</p>
							</section>
						</article>
					</div> */}
				</main>
			</SignedIn>
			<SignedOut>
				<RedirectToSignIn />
			</SignedOut>
		</div>
	);
}
