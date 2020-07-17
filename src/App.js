import React from "react";
import styled from "@emotion/styled";

import Header from "./components/Header";
import DownGit from "./containers/DownGit";

const AppContainer = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  margin-top: 80px;
`;

const Main = () => (
  <AppContainer>
    <Header />
    <DownGit />
  </AppContainer>
);

export default Main;
