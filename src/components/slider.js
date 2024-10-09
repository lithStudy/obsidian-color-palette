import styled, { css } from 'styled-components'

const sliderThumbStyles = css`
	//all: unset !important;
  height: 10px !important;
  width: 10px !important;
  transform: scale(var(--thumbScale)) !important;
  border-radius: 50% !important;
  color: inherit !important;
  background: var(--bodyColor) !important;
  cursor: pointer !important;
  -webkit-appearance: none !important;
  //margin-top: -4px !important;
`

const sliderTrackStyles = css`
	all: unset !important;
  width: 100% !important;
  height: 2px !important;
  cursor: pointer !important;
  background: var(--bodyDimmed) !important;
  border-radius: 2px !important;
`

const Slider = styled.input`
	all: unset !important;
  --thumbScale: 1 !important;
	padding-top: 15px !important;

  width: 96px !important;
  height: 12px !important;
  -webkit-appearance: none !important;
  margin: 0 !important;
  display: block !important;
  cursor: pointer !important;
  //margin-top: 8px !important;
  //margin-bottom: 8px !important;
  background-color: transparent !important;

  &:focus {
    outline: none !important;
    --thumbScale: 1.2 !important;
  }
  &::-webkit-slider-runnable-track {
    ${sliderTrackStyles}
  }
  &::-webkit-slider-thumb {
    ${sliderThumbStyles}
  }
  &::-moz-range-track {
    ${sliderTrackStyles}
  }
  &::-moz-range-thumb {
    ${sliderThumbStyles}
  }
  &::-ms-track {
    ${sliderTrackStyles}
  }
  &::-ms-fill-lower {
    background: #D8D8D8 !important;
    border-radius: 2px !important;
  }
  &::-ms-fill-upper {
    background: #D8D8D8 !important;
    border-radius: 2px !important;
  }
  &::-ms-thumb {
    ${sliderThumbStyles}
  }
  &:focus::-ms-fill-lower {
    background: #D8D8D8 !important;
  }
  &:focus::-ms-fill-upper {
    background: #D8D8D8 !important;
  }
`

export default Slider
