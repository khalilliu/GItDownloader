import React from "react";
import styled from "@emotion/styled";

const Header = () => (
  <HeadContianer>
    <Title>
      <a href="/" target="blank">
        GitDown
      </a>
    </Title>
    <Description>Create GitHub Resource Download Link</Description>
  </HeadContianer>
);

const HeadContianer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #4a4f64;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 2.4rem;
  padding-bottom: 20px;
  & a {
    color: #4a4f64;
    text-decoration: none;
  }
`;

const Description = styled.h4`
  font-size: 1.2rem;
  font-family: inherit;
  font-weight: 500;
  line-height: 1.2;
  color: inherit;
`;

export default Header;
