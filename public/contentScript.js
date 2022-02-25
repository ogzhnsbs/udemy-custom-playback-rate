/*global chrome*/
function setAllVideosPlaybackRate(playbackRate, doc = document) {
  try {
    if (!playbackRate) {
      return;
    }
    const videos = doc.getElementsByTagName("video");
    Array.from(videos).forEach((v) => {
      v.playbackRate = playbackRate?.enabled ? playbackRate.value : 1;
    });

    const iframes = doc.getElementsByTagName("iframe");
    Array.from(iframes).forEach((i) => {
      const innerDoc = i.contentDocument || i.contentWindow.document;
      if (innerDoc) {
        setAllVideosPlaybackRate(playbackRate, innerDoc);
      }
    });
  } catch (exception) {}
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  sendResponse("ok");
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
