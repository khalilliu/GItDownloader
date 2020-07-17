import React, { useState } from "react";
import styled from "@emotion/styled";

const Form = () => {
  const [url, setUrl] = useState("");

  const handleDownload = e => {
    e.preventDefault();
    if (url.trim() !== "" && url.match("https?://github.com/.+/.+")) {
      window.history.pushState({}, null, "/?url=" + url);
    }
    return false;
  };

  return (
    <Container>
      <Input
        type="text"
        placeholder="Github File or Directory Link"
        onChange={e => setUrl(e.target.value)}
      />
      <div>
        <Button onClick={e => handleDownload(e)}>Download</Button>
      </div>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  margin: 20px auto;
  width: 600px;
  flex-direction: column;
  justify-content: center;
`;

const Input = styled.input`
  display: block;
  width: 100%;
  height: 34px;
  padding: 6px 12px;
  font-size: 14px;
  line-height: 1.42857143;
  color: #555;
  background-color: #fff;
  background-image: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
  transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
  margin-bottom: 20px;
  &:focus {
    border-color: #66afe9;
    outline: 0;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
      0 0 8px rgba(102, 175, 233, 0.6);
  }
`;
const Button = styled.button`
  color: #333;
  background-color: #fff;
  border-color: #ccc;
  display: inline-block;
  padding: 6px 12px;
  margin-bottom: 0;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.42857143;
  text-align: center;
  white-space: nowrap;
  touch-action: manipulation;
  cursor: pointer;
  user-select: none;
  background-image: none;
  border-radius: 4px;
  border-width: 1px;
  border-style: solid;
  border-color: rgb(216, 216, 216) rgb(209, 209, 209) rgb(186, 186, 186);
  border-image: initial;
  outline: none;
  &:hover {
    color: #333;
    background-color: #e6e6e6;
    border-color: #adadad;
  }
  &:active {
    color: #333;
    background-color: #e6e6e6;
    border-color: #adadad;
    box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
  }
`;

export default Form;
