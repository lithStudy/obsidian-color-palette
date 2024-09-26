import { useState } from "react";
import {
	calculateShadesTemp,
	calculateTintsTemp,
	copyToClipboard,
	createTintsAndShadesTemp,
	parseColorValuesTemp
} from "utils/colorUtil";
import * as React from "react";
import 'src/css/common.css'

export const TintShadeView = () => {
	const [inputColorStr, setInputColorStr] = useState<string>(""); // 保存从 kcppResult.colors 得到的 RGBA 数组
	const [colors, setColors] = useState<[]>([]); // 保存从 kcppResult.colors 得到的 RGBA 数组
	const [hoveredIndex, setHoveredIndex] = useState<string>(""); // Track hovered color index
	// 更新方法名称并调整逻辑以响应按钮点击
	const handleColorUpdate = () => {
		// const colorDisplayTable = createTintsAndShadesTemp(inputColorStr);
		const parsedColorsArray = parseColorValuesTemp(inputColorStr);
		if (parsedColorsArray == null) {
			return;
		}

		const colorDisplayRows = []; // Holds HTML table rows for the colors to display
		let tableRowCounter = 0;
		parsedColorsArray.forEach(color => { // Iterate through each inputted color value
			const calculatedColorObj={};
			// Calculate an array of shades from the inputted color, then make a table row from the shades, and a second table row for the hex values of the shades
			const calculatedShades = calculateShadesTemp(color);
			// colorDisplayRows[tableRowCounter] = makeTableRowColors(calculatedShades, "colors");
			// tableRowCounter++;

			// Calculate an array of tints from the inputted color, then make a table row from the tints, and a second table row for the hex values of the tints
			const calculatedTints = calculateTintsTemp(color);
			// colorDisplayRows[tableRowCounter] = makeTableRowColors(calculatedTints, "colors");
			// tableRowCounter++;
			calculatedColorObj.calculatedShades = calculatedShades;
			calculatedColorObj.calculatedTints = calculatedTints;
			colorDisplayRows.push(calculatedColorObj);
		});
		console.log("colorDisplayRows:"+colorDisplayRows)
		setColors(colorDisplayRows);


		// @ts-ignore
		// document.getElementById("tints-and-shades").innerHTML = colorDisplayTable;
	};

	// @ts-ignore
	return (
		<div className="palette-app-container">
			<h3>相似颜色</h3>
			<div className="input-class">
				{/* 添加输入框和按钮 */}
				<input
					type="text"
					value={inputColorStr}
					onChange={(e) => setInputColorStr(e.target.value)}
					placeholder="Enter colors here"
				/>
				<button onClick={handleColorUpdate}>Generate Tints and Shades</button>
			</div>

			<div id="tints-and-shades">

				{colors.length > 0 && (
					<div className="color-palette">
						<div className="color-container">
							{colors.map((color, index) => (
								<div key={index} className="color-group">
									<div className="shade-squares">
										{color.calculatedShades.map((shade, shadeIndex) => (
											<div
												key={shadeIndex}
												className="color-square"
												style={{
													backgroundColor: `#${shade}`,
													position: 'relative',
													cursor: 'pointer'
												}}
												onMouseEnter={() => setHoveredIndex(`shade-${shadeIndex}`)}
												onMouseLeave={() => setHoveredIndex(null)}
												onClick={() => copyToClipboard(shade)}
											>
												{hoveredIndex === `shade-${shadeIndex}` && (
													<div className="copy-icon">📋</div>
												)}
											</div>
										))}
									</div>
									<div className="tint-squares">
										{color.calculatedTints.map((tint, tintIndex) => (
											<div
												key={tintIndex}
												className="color-square"
												style={{
													backgroundColor: `#${tint}`,
													position: 'relative',
													cursor: 'pointer'
												}}
												onMouseEnter={() => setHoveredIndex(`tint-${tintIndex}`)}
												onMouseLeave={() => setHoveredIndex(null)}
												onClick={() => copyToClipboard(tint)}
											>
												{hoveredIndex === `tint-${tintIndex}` && (
													<div className="copy-icon">📋</div>
												)}
											</div>

										))}
									</div>
								</div>
							))}
						</div>
					</div>
				)}


			</div>

		</div>
	);
};
