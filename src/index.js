import child_process from "child_process";
import { getStream, launch } from "puppeteer-stream";
import { ffmpegArgs, puppeteerArgs, testStreamKey, URL } from "./constants.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const Xvfb = require("xvfb");

const xvfb = new Xvfb({
  silent: true,
  xvfb_args: ["-screen", "0", "1920x1080x24", "-ac"],
});

async function main() {
  try {
    xvfb.startSync((err) => {
      console.error("Error while starting XVFB - ", err);
    });

    const browser = await launch({
      defaultViewport: null,
      headless: false,
      args: puppeteerArgs(xvfb._display),
    });

    const page = await browser.newPage();

    await page.evaluateOnNewDocument(async () => {
      console.info(`Recording bot going to - ${URL}`);
    });

    await page.goto(URL, {
      waitUntil: "networkidle2",
      timeout: 0,
    });

    const stream = await getStream(page, { audio: true, video: true });

    const ffmpeg = child_process.spawn("ffmpeg", ffmpegArgs(testStreamKey));

    // stream.pipe(ffmpeg.stdin);

    stream.on("data", (data) => {
      console.info(Date.now(), " - received data");
      ffmpeg.stdin.write(data);
    });
  } catch (error) {
    console.error(error);
  }
}

main();
