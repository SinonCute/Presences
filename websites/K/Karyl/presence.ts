const presence = new Presence({
		clientId: "1131800161060921394",
});

let video = {
	exists: false,
	duration: 0,
	currentTime: 0,
	paused: true,
};

presence.on(
	"iFrameData",
	(data: {
		exists: boolean;
		duration: number;
		currentTime: number;
		paused: boolean;
	}) => {
		video = data;
	}
);

presence.on("UpdateData", async () => {
	const presenceData: PresenceData = {
		largeImageKey: "https://www.karyl.live/assets/logo/weblogo.png",
	},
		{ pathname, href } = document.location;

	if (pathname.includes("/info")) {
		const title = document.querySelector("body > div.flex-grow.mb-5 > div > div > div.mt-24.z-10.flex.flex-col.grid-in-title.relative.min-w-0.pb-\\[\\.5rem\\].pl-\\[\\.5rem\\].pr-\\[\\.5rem\\].justify-end > div.mb-1.line-clamp-2.text-2xl.sm\\:text-3xl.text-white.font-bold").textContent,
		 posterImg = document.querySelector("body > div.flex-grow.mb-5 > div > div > div.grid-in-art.z-10.mt-24 > a > img").getAttribute("src");

		presenceData.state = "Viewing Anime Info";
		presenceData.details = title;
		presenceData.smallImageKey = Assets.Viewing;
		presenceData.smallImageText = "Viewing Anime Info";

		presenceData.largeImageKey = posterImg;
		presenceData.buttons = [
			{
				label: "View Anime",
				url: href,
			},
		];

	} else if (video.exists) {
		const [startTimestamp, endTimestamp] = presence.getTimestamps(
				Math.floor(video.currentTime),
				Math.floor(video.duration)
			),
			coverArt = `https://img.anili.st/media/${pathname.match(/\/watch\/(\d+)/)?.[1]}`,

			episodeName = document.querySelector(
				"head > title"
			)?.textContent?.match(/Watching (.+?) \|/)?.[1]?.trim();

		presenceData.details = episodeName || "Watching";
		presenceData.state = `Episode ${document
					.querySelector("head > title")
					?.textContent?.match(/Episode (\d+)/)?.[1]}`;

		presenceData.buttons = [
			{
				label: "Watch Video",
				url: href,
			},
		];
		presenceData.largeImageKey = coverArt;
		presenceData.smallImageKey = video.paused ? Assets.Pause : Assets.Play;
		presenceData.smallImageText = video.paused ? "Paused" : "Playing";

		presenceData.startTimestamp = startTimestamp;
		presenceData.endTimestamp = endTimestamp;

		if (video.paused) {
			delete presenceData.startTimestamp;
			delete presenceData.endTimestamp;
		}
	} else {
		presenceData.details = "Browsing";
		presenceData.smallImageKey = Assets.Search;
		presenceData.smallImageText = "Searching";
	}

	presence.setActivity(presenceData);
});
