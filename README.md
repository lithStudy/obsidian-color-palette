[中文](readmefile/README_CN.md)
# Overview
This is a palette tool that includes some of my favorite color selection capabilities.

# Features
## Extract Dominant Colors
Analyze the uploaded image to extract the main hues. You can choose the number of colors to extract; by default, it extracts 5 colors.

## Generate Similar Colors
Input one or more colors to generate 11 lighter and 11 darker shades for each, useful for pairing with adjacent colors.

## Color Wheel
Select colors on an HSB color wheel and allow copying the hex color codes.

# Demo
![case.gif](readmefile/case.gif)

# Future Plans
1. To add a snapshot color block to the right side of the color wheel
2. Add other color schemes.
3. Allow saving palettes as notes (this will be integrated with the plugin: https://github.com/ALegendsTale/obsidian-color-palette).

# Acknowledgments
The dominant color extraction algorithm comes from: https://github.com/ppzreboot/k-colors.js/tree/main  
The similar color generation comes from: https://github.com/edelstone/tints-and-shades

Additionally, thanks to GPT4O, which made it effortless for me as a backend developer to complete this frontend project.
