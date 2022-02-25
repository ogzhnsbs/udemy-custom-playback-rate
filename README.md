# Udemy Custom Playback Rate

## Available Scripts

In the root project directory, you can run:

### `make build`

Prepares the app build for upload to chrome://extensions/ and the Google Chrome Webstore \
It correctly bundles your project and optimizes the build for use as a Chrome Extension. \

This command creates two things:

1.  A `./dist` directory that contains the files for `chrome://extensions/` -- use this folder to load the unpacked extension
2.  A file called latestBuild.zip, this .zip can be uploaded to the Developer Console when submitting your extension to the Chrome Web Store
