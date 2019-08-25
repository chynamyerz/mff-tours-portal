import React from "react";
import styled from "styled-components";

const LoadSpinnerWrapper = styled.div`
{
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  z-index: 2;
}
`;

const LoadSpinner = styled.div`
{
  border: 10px solid purple;
  border-color: purple transparent purple transparent;
  border-radius: 50%;
  width: 200px;
  height: 200px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
`;
const Spinner = () => (
  <LoadSpinnerWrapper>
    <LoadSpinner />
  </LoadSpinnerWrapper>
);

export { Spinner };