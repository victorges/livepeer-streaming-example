# livepeer-streaming-example
This is an example application using a chromium instance (made headful using xvfb) screen-record itself and then have the buffer array write to ffmpeg which uses the livepeer's RTMP ingest URL 

## Steps to install and run:
-> ensure that you have xvfb and ffmpeg installed on your machines </br>
-> change livepeer streamkey in `./constants.js` </br>
-> `npm i` </br>
-> `npm run dev` </br>
