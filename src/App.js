/*global chrome*/
import React from "react";
import "./App.css";
import Switch from "react-switch";

const options = [1, 2, 2.25, 2.5, 2.75, 3, 4];

// Switch component to enable/disable extension
const ExtensionActivator = ({ playbackRate, handleChange }) => {
  return (
    <div className="enable-wrapper">
      <span style={{ marginRight: 8 }}>
        {playbackRate.enabled ? "Active" : "Inactive"}
      </span>
      <Switch
        onColor="#06f"
        height={21}
        width={42}
        checked={playbackRate.enabled}
        onChange={(checked) => {
          handleChange((old) => ({
            ...old,
            enabled: checked,
          }));
        }}
      />
    </div>
  );
};

// Input component for custom speed
const CustomSpeed = ({ playbackRate, handleChange }) => {
  return (
    <div className="item" style={{ marginTop: 8 }}>
      <span style={{ marginRight: 8 }}>Custom</span>
      <input
        type="number"
        name="tentacles"
        min=".25"
        max="10"
        step=".25"
        value={playbackRate.value}
        onChange={(event) => {
          const newVal = parseFloat(event.target.value);
          if (!isNaN(newVal)) {
            handleChange({
              ...playbackRate,
              value: newVal,
              custom: true,
            });
          }
        }}
      />
      <input
        type="radio"
        name="speed"
        value={playbackRate.value}
        checked={playbackRate.custom}
        onChange={(event) => {
          const newVal = parseFloat(event.target.value);
          if (!isNaN(newVal)) {
            handleChange({
              value: newVal,
              custom: true,
              enabled: playbackRate.enabled,
            });
          }
        }}
      />
    </div>
  );
};

const App = () => {
  const [playbackRate, setPlaybackRate] = React.useState({
    value: 1,
    custom: false,
    enabled: true,
  });

  const handleChange = (newPlaybackRate) => {
    try {
      setPlaybackRate(newPlaybackRate);

      // set storage and notify active tab
      chrome.storage.local.set({ playbackRate: newPlaybackRate }, () => {});
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        try {
          chrome.tabs.sendMessage(
            tabs[0].id,
            { playbackRate: newPlaybackRate },
            function () {}
          );
        } catch (exception) {}
      });
    } catch (exception) {}
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
        <ExtensionActivator {...{ playbackRate, handleChange }} />
        <div
          className="itemListWrapper"
          style={{ pointerEvents: playbackRate.enabled ? "auto" : "none" }}
        >
          {options.map((o, i) => {
            return (
              <div key={i} className="item">
                <span>{o}x</span>
                <input
                  type="radio"
                  name="speed"
                  value={o}
                  checked={!playbackRate.custom && playbackRate.value === o}
                  onChange={(event) => {
                    handleChange({
                      value: parseFloat(event.target.value),
                      enabled: playbackRate.enabled,
                    });
                  }}
                />
              </div>
            );
          })}
          <CustomSpeed {...{ playbackRate, handleChange }} />
        </div>
      </div>
    </div>
  );
};

export default App;
