import child_process from "child_process";
import fs from "fs";
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

    // await page.evaluateOnNewDocument(async () => {
      console.info(`Recording bot going to - ${URL}`);
    });

      await page.goto(URL, {
        waitUntil: "networkidle2",
        timeout: 0,
      });
    // });


    const stream = await getStream(page, { 
      audio: true, video: true, 
      audioBitsPerSecond: 128 * 1000,
      videoBitsPerSecond: 3 * 1024 * 1024 });

    const file = fs.createWriteStream(`./out/output-${Date.now()}.webm`); 
    const ffmpeg = child_process.spawn("ffmpeg", ffmpegArgs(testStreamKey));

    setTimeout(async () => {
        await stream.destroy();
        file?.close();
        ffmpeg?.kill('SIGINT')
        ffmpeg?.stdin.end()
        console.log("finished");
    }, 1000 * 60 * 10);

    ffmpeg.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });
    ffmpeg.stderr.pipe(process.stdout);
    ffmpeg.stdout.pipe(process.stdout); 

    stream.on("data", (data) => {
      // console.info(Date.now(), " - received data");
      file?.write(data);
      ffmpeg?.stdin.write(data);
    });
  } catch (error) {
    console.error(error);
  }
}

main();
