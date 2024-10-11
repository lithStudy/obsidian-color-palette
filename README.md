[中文](readmefile/README_CN.md)
# Overview
This is a palette tool that includes some of my favorite color selection capabilities.

# Features
## 调色板
Specify a color to generate darker and lighter shades.
![palette.png](readmefile%2Fpalette.png)
## 取色板
Analyze the uploaded image to extract the main color tones.
![pipette.png](readmefile%2Fpipette.png)


# Installation
Not yet available in the official repository, please install manually:
## Option One
Download the zip archive from the releases section. After extracting it, simply drag the unzipped folder into the Obsidian plugins directory.
## Option Two
1. Create a new folder in the Obsidian plugins folder and name it `obsidian-color-palette-tool`.
2. Copy the `main.js`, `style.css`, and `manifest.json` files from this repository into the folder created above.
3. Installation is now complete. You will see `Color Palette Plugin` in the list of installed third-party plugins in Obsidian. Enable it.
4. After enabling, a color palette button will appear in the sidebar. Click it to access the tool.


# Future Plans
1. To add a snapshot color block to the right side of the color wheel
2. Add other color schemes.
3. Allow saving palettes as notes (this will be integrated with the plugin: https://github.com/ALegendsTale/obsidian-color-palette).

# Acknowledgments
The dominant color extraction algorithm comes from: https://github.com/ppzreboot/k-colors.js/tree/main  
The similar color generation comes from: https://github.com/edelstone/tints-and-shades

Additionally, thanks to GPT4O, which made it effortless for me as a backend developer to complete this frontend project.
