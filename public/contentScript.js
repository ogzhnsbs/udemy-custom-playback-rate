/*global chrome*/
function recursiveVideoHandler(handler, doc = document) {
  try {
    const videos = doc.getElementsByTagName("video");
    Array.from(videos).forEach((v) => {
      handler(v);
    });

    const iframes = doc.getElementsByTagName("iframe");
    Array.from(iframes).forEach((i) => {
      try {
        const innerDoc = i.contentDocument || i.contentWindow.document;
        if (innerDoc) {
          recursiveVideoHandler(handler, innerDoc);
        }
      } catch (ex) {}
    });
  } catch (exception) {}
}

function setAllVideosPlaybackRate(playbackRate) {
  if (!playbackRate) {
    return;
  }

  recursiveVideoHandler((video) => {
    video.playbackRate = playbackRate?.enabled ? playbackRate.value : 1;
  });
}

function skipRunningVideos(skip) {
  if (!skip) {
    return;
  }

  recursiveVideoHandler((video) => {
    if (!video.paused) {
      video.currentTime = video.duration;
    }
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  sendResponse("ok");
  skipRunningVideos(message?.skipRunningVideo);
  setAllVideosPlaybackRate(message?.playbackRate);
});

function nodeInsertedCallback(event) {
  try {
    chrome.storage.local.get(["playbackRate"], function (items) {
      setAllVideosPlaybackRate(items["playbackRate"]);
    });
  } catch (exception) {}
}
document.addEventListener("DOMNodeInserted", nodeInsertedCallback);
