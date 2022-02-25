/*global chrome*/
function setAllVideosPlaybackRate(playbackRate, doc = document) {
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
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  setAllVideosPlaybackRate(message?.playbackRate);
  sendResponse("ok");
});

function nodeInsertedCallback(event) {
  chrome.storage.local.get(["playbackRate"], function (items) {
    setAllVideosPlaybackRate(items["playbackRate"]);
  });
}
document.addEventListener("DOMNodeInserted", nodeInsertedCallback);
