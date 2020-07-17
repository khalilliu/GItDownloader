import React, { useState, useEffect } from "react";
import { on, off } from "./util";

const patchHistoryMethod = method => {
  const original = window.history[method];

  window.history[method] = function(state) {
    const result = original.apply(this, arguments);
    const event = new Event(method.toLowerCase());

    event.state = state;
    console.log(event, "ev");
    window.dispatchEvent(event);

    return result;
  };
};

patchHistoryMethod("pushState");
patchHistoryMethod("replaceState");

const buildState = trigger => {
  const { state, length } = window.history;
  const {
    hash,
    host,
    hostname,
    href,
    origin,
    pathname,
    port,
    protocol,
    search
  } = window.location;
  return {
    trigger,
    state,
    length,
    hash,
    host,
    hostname,
    href,
    origin,
    pathname,
    port,
    protocol,
    search
  };
};

const useLocation = () => {
  const [state, setState] = useState(buildState("load"));
  useEffect(() => {
    const onPopstate = () => setState(buildState("popstate"));
    const onPushstate = () => setState(buildState("pushstate"));
    const onReplacestate = () => setState(buildState("replacestate"));

    on(window, "popstate", onPopstate);
    on(window, "pushstate", onPushstate);
    on(window, "replacestate", onReplacestate);

    return () => {
      off(window, "popstate", onPopstate);
      off(window, "pushstate", onPushstate);
      off(window, "replacestate", onReplacestate);
    };
  }, []);

  return state;
};

export default useLocation;
