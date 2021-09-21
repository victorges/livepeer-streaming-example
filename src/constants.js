const URL = "https://www.youtube.com/watch?v=OrrkuUlFfOQ";

const testStreamKey = "df18-hte7-u0lv-fey3";

const puppeteerArgs = (display) => {
  [
    "--enable-usermedia-screen-capturing",
    "--allow-http-screen-capture",
    "--no-sandbox",
    "--allow-insecure-localhost",
    "--autoplay-policy=no-user-gesture-required",
    "--start-fullscreen",
    "--window-size=1920,1080",
    `--display=${display}`,
  ];
};

const ffmpegArgs = (streamKey) => {
  return [
    "-i", "-",

    
    // video codec config: low latency, adaptive bitrate
    "-c:v", "libx264",
    "-x264-params", "keyint=60:scenecut=0",
    "-vsync", "1",
    // "-max_interleave_delta", "0",
    // "-preset", "veryfast",
    // "-tune", "zerolatency",

    // audio codec config: sampling frequency (11025, 22050, 44100), bitrate 64 kbits
    "-c:a", "aac",
    "-ar", "44100",
    "-b:a", "128k",
    "-max_muxing_queue_size", "8192",
    //force to overwrite
    // "-y",

    // used for audio sync
    // "-use_wallclock_as_timestamps", "1",
    // "-async", "1",

    //'-filter_complex', 'aresample=44100', // resample audio to 44100Hz, needed if input is not 44100
    //'-strict', 'experimental',
    // "-bufsize", "1000",

    "-f", "flv",
    `rtmp://rtmp.livepeer.com/live/${streamKey}`,
    // `out/output-${Date.now()}.flv`
  ];
};

export { URL, puppeteerArgs, ffmpegArgs, testStreamKey };
