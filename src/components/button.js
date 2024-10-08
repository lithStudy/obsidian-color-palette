import React from 'react'
import styled from 'styled-components'

const Button = styled.button`
	all: unset;
	box-shadow:none !important;
  appearance: none !important;
  border: none !important;
  font: inherit !important;
  color: inherit !important;
  background-color: var(--bodyXDimmed) !important;
  padding: 0.4em 0.75em !important;
  cursor: pointer !important;

  &:focus {
    outline: none !important;
    background-color: var(--bodyDimmed) !important;
  }
  &:active {
    background-color: var(--bodyColor) !important;
  }
`

export default Button
