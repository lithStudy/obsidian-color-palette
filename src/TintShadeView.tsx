import { useState } from "react";
import { createTintsAndShadesTemp } from "utils/colorUtil";
import * as React from "react";

export const TintShadeView = () => {
	const [colors, setColors] = useState<string>(""); // 保存从 kcppResult.colors 得到的 RGBA 数组

	// 更新方法名称并调整逻辑以响应按钮点击
	const handleColorUpdate = () => {
		const colorDisplayTable = createTintsAndShadesTemp(colors);
		document.getElementById("tints-and-shades").innerHTML = colorDisplayTable;
	};

	return (
		<div className="App">
			<div className="input-class">
				{/* 添加输入框和按钮 */}
				<input
					type="text"
					value={colors}
					onChange={(e) => setColors(e.target.value)}
					placeholder="Enter colors here"
				/>
				<button onClick={handleColorUpdate}>Generate Tints and Shades</button>
			</div>

			<div id="tints-and-shades">

			</div>

			<style jsx>{`
				.app-container {
					font-family: Arial, sans-serif;
					padding: 20px;
				}
				.input-class{
					float: left;
					width: 100%;
				}
				#tints-and-shades{
					float: left;
					width: 100%;
				}

				h1, h2 {
					text-align: center;
				}
			`}</style>
		</div>
	);
};
