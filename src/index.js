import React from "react";
import ReactDOM from "react-dom";
import { injectGlobal } from "emotion";
import { Router } from "@reach/router";

import Main from "./App";

injectGlobal`
  * {
    padding: 0;
    margin:0;
    box-sizing: border-box;
    }
  body {
    font-family: sans-serif, arial;
    color: #4A4F64;
    font-size: 14px;
    line-height: 1.42857143;
    background-color: #fff;
    margin:0;
    padding:0;
    }
`;

function App() {
  return (
    <Router>
      <Main path="/" />
    </Router>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
