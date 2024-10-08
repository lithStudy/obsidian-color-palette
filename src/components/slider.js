import styled, { css } from 'styled-components'

const sliderThumbStyles = css`
  height: 10px;
  width: 10px;
  transform: scale(var(--thumbScale));
  border-radius: 50%;
  color: inherit;
  background: var(--bodyColor);
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -4px;
`

const sliderTrackStyles = css`
  width: 100%;
  height: 2px;
  cursor: pointer;
  background: var(--bodyDimmed);
  border-radius: 2px;
`

const Slider = styled.input`
	all: unset !important;
  --thumbScale: 1 !important;

  width: 96px !important;
  height: 12px !important;
  -webkit-appearance: none !important;
  margin: 0 !important;
  display: block !important;
  cursor: pointer !important;
  margin-top: 8px !important;
  margin-bottom: 8px !important;
  background-color: transparent !important;

  &:focus {
    outline: none;
    --thumbScale: 1.2;
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
    background: #D8D8D8;
    border-radius: 2px;
  }
  &::-ms-fill-upper {
    background: #D8D8D8;
    border-radius: 2px;
  }
  &::-ms-thumb {
    ${sliderThumbStyles}
  }
  &:focus::-ms-fill-lower {
    background: #D8D8D8;
  }
  &:focus::-ms-fill-upper {
    background: #D8D8D8;
  }
`

export default Slider
