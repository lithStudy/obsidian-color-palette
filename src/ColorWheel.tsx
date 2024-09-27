import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { copyToClipboard, hsvToHex } from "./utils/colorUtil";

const HSVColorWheel = () => {
	const canvasRef = useRef(null);
	const triangleRef = useRef(null);
	const [hue, setHue] = useState(0);
	const [saturation, setSaturation] = useState(1);
	const [value, setValue] = useState(1);
	const [selectedHSV, setSelectedHSV] = useState({ h: 0, s: 1, v: 1 });
	const [selectedHex, setSelectedHex] = useState<string>();

	// 绘制色相圆环
	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		const radius = canvas.width / 2;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		for (let angle = 0; angle < 360; angle += 1) {
			const startAngle = (angle * Math.PI) / 180;
			const endAngle = ((angle + 1) * Math.PI) / 180;

			ctx.beginPath();
			ctx.arc(radius, radius, radius - 20, startAngle, endAngle);
			ctx.lineWidth = 20;
			ctx.strokeStyle = `hsl(${angle}, 100%, 50%)`;
			ctx.stroke();
		}

		// 绘制选中色相的小圆圈
		const hueAngle = (hue * Math.PI) / 180;
		const x = radius + (radius - 20) * Math.cos(hueAngle);
		const y = radius + (radius - 20) * Math.sin(hueAngle);
		ctx.beginPath();
		ctx.arc(x, y, 10, 0, 2 * Math.PI);
		ctx.fillStyle = hsvToHex(hue, saturation, value); // 将颜色设置为选中的颜色
		ctx.fill();
		ctx.strokeStyle = "white";
		ctx.lineWidth = 2;
		ctx.stroke();
	}, [hue, saturation, value]);

	// 绘制饱和度-明度
	useEffect(() => {
		const triangleCanvas = triangleRef.current;
		const ctx = triangleCanvas.getContext("2d");
		const width = triangleCanvas.width;
		const height = triangleCanvas.height;

		// 创建饱和度-明度
		const gradient = ctx.createLinearGradient(0, 0, width, 0);
		gradient.addColorStop(0, `hsl(${hue}, 0%, 100%)`);
		gradient.addColorStop(1, `hsl(${hue}, 100%, 50%)`);

		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, width, height);

		const gradient2 = ctx.createLinearGradient(0, 0, 0, height);
		gradient2.addColorStop(0, `rgba(0, 0, 0, 0)`);
		gradient2.addColorStop(1, `rgba(0, 0, 0, 1)`);

		ctx.fillStyle = gradient2;
		ctx.fillRect(0, 0, width, height);

		// 绘制选中SV的小圆圈
		const svX = saturation * width;
		const svY = (1 - value) * height;
		ctx.beginPath();
		ctx.arc(svX, svY, 5, 0, 2 * Math.PI);
		ctx.fillStyle = "white";
		ctx.fill();
		ctx.strokeStyle = "black";
		ctx.stroke();
	}, [hue, saturation, value]);

	const handleHueSelection = (e: { clientX: number; clientY: number }) => {
		const rect = canvasRef.current.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		const radius = canvasRef.current.width / 2;
		const angle = Math.atan2(y - radius, x - radius) * (180 / Math.PI);
		const hue = angle < 0 ? angle + 360 : angle;
		setHue(hue);
		setSelectedHSV({ ...selectedHSV, h: hue });
		setSelectedHex(hsvToHex(hue, saturation, value));
	};

	const handleSVSelection = (e: { clientX: number; clientY: number }) => {
		const rect = triangleRef.current.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		const saturation = Math.min(1, Math.max(0, x / rect.width));
		const value = Math.min(1, Math.max(0, 1 - y / rect.height));
		setSaturation(saturation);
		setValue(value);
		setSelectedHSV({ h: hue, s: saturation, v: value });
		setSelectedHex(hsvToHex(hue, saturation, value));
	};

	const copyFunction = () => {
		copyToClipboard(selectedHex);
	};

	return (
		<div className="palette-app-container">
			<h3>Color Wheel</h3>

			<div style={{ width: "100%", float: "left" }}>
				<canvas
					ref={canvasRef}
					width={300}
					height={300}
					style={{ cursor: "crosshair" }}
					onClick={handleHueSelection}
				/>
			</div>
			<div style={{ width: "100%", float: "left", marginBottom: "-150px" }}>
				<canvas
					ref={triangleRef}
					width={150}
					height={150}
					style={{
						cursor: "crosshair",
						position: "relative",
						top: "-230px",
						left: "75px",
					}}
					onClick={handleSVSelection}
				/>
			</div>

			<div style={{ marginTop: "20px", fontWeight: "bold" }}>
				Selected color:
				hsv({Math.round(selectedHSV.h)}, {Math.round(selectedHSV.s * 100)}%,{" "}
				{Math.round(selectedHSV.v * 100)}%) --- hex({selectedHex})
			</div>
			<button onClick={copyFunction} style={{ marginTop: "10px", cursor: "pointer" }}>
				Copy hex to Clipboard
			</button>
		</div>
	);
};

export default HSVColorWheel;
