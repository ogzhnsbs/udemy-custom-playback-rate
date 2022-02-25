/*global chrome*/
import React from "react";
import "./App.css";

const options = [1, 2, 2.25, 2.5, 2.75, 3, 4];

const App = () => {
  const [playbackRate, setPlaybackRate] = React.useState({
    value: 1,
    custom: false,
  });

  const handleChange = (newPlaybackRate) => {
    setPlaybackRate(newPlaybackRate);
    chrome.storage.local.set({ playbackRate: newPlaybackRate }, () => {});

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      tabs.forEach((tab) => {
        if (!tab?.url) {
          return;
        }

        // let domain = new URL(tab.url);
        // if (!domain.host.includes(".com")) {
        //   return;
        // }

        chrome.tabs.sendMessage(
          tab.id,
          { playbackRate: newPlaybackRate },
          function () {}
        );
      });
    });
  };

  const setStatusFromStorage = () => {
    chrome.storage.local.get(["playbackRate"], (items) => {
      if (items["playbackRate"]) {
        setPlaybackRate(items["playbackRate"]);
      }
    });
  };

  React.useEffect(() => {
    setStatusFromStorage();
    chrome.storage.onChanged.addListener(() => {
      setStatusFromStorage();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <div className="App-activation">
        {options.map((o, i) => {
          return (
            <div key={i} className="item">
              <span>{o}x</span>
              <input
                type="radio"
                value={o}
                name="speed"
                checked={playbackRate.value === o && !playbackRate.custom}
                onChange={(event) => {
                  const newVal = parseFloat(event.target.value);
                  handleChange({
                    value: newVal,
                    custom: false,
                  });
                }}
              />
            </div>
          );
        })}
        <div className="item" style={{ marginTop: 8 }}>
          <span style={{ marginRight: 8 }}>Custom</span>
          <input
            type="number"
            id="tentacles"
            name="tentacles"
            min="1"
            max="10"
            step=".25"
            value={playbackRate.value}
            onChange={(event) => {
              const newVal = parseFloat(event.target.value);
              if (!isNaN(newVal)) {
                handleChange({
                  value: newVal,
                  custom: true,
                });
              }
            }}
          />
          <input
            type="radio"
            value={playbackRate.value}
            name="speed"
            checked={playbackRate.custom}
            onChange={(event) => {
              const newVal = parseFloat(event.target.value);
              if (!isNaN(newVal)) {
                handleChange({
                  value: newVal,
                  custom: true,
                });
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
