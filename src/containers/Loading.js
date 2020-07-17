import React from "react";
import styled from "@emotion/styled";
import Spinner from "../components/Spinner";

const Loading = ({ totalFiles, downloadedFiles, isLoading }) => {
  return (
    <LoadingContainer>
      {!!isLoading ? (
        <>
          <Spinner width={80} height={80} color="#4a4f64" />
          <p style={{ paddingTop: "20px" }}>
            {downloadedFiles} / {totalFiles}
          </p>
        </>
      ) : (
        ""
      )}
    </LoadingContainer>
  );
};

const LoadingContainer = styled.div`
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

export default Loading;
