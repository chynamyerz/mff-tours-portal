import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.p.attrs({
  className: "error tile"
})`
  && {
    text-align: left;
    color: hsl(348, 100%, 61%);
  }
`;

export const Error = (props: any) => (<ErrorContainer>{props.children}</ErrorContainer>)