const iframe = new iFrame();

iframe.on("UpdateData", async () => {
	if (document.querySelector(".art-video")) {
		const video: HTMLVideoElement = document.querySelector(".art-video");
		if (video && !isNaN(video.duration)) {
			iframe.send({
				exists: true,
				duration: video.duration,
				currentTime: video.currentTime,
				paused: video.paused,
			});
		}
	}
});
