import React from 'react';
import styled from 'styled-components';

const ErrorMessageContainer = styled.p.attrs({
  className: "error tile"
})`
  && {
    text-align: left;
    margin: 3px 0 3px 0;
    padding: 2px 0 2px 0;
    background-color: hsl(348, 100%, 61%);
    color: white;
  }
`;

export const ErrorMessage = (props: any) => (<ErrorMessageContainer>{props.children}</ErrorMessageContainer>)