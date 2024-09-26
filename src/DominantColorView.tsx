import * as React from "react";
import { useState, useEffect } from "react";
import MyWorker from 'src/woker/myworker.worker';
import {KCPP_result} from "k-colors"; // Make sure this path is correct
import {copyToClipboard, rgbToHexTemp} from "utils/colorUtil";
import 'src/css/common.css'

const worker = new MyWorker();

export const DominantColorView = () => {
	const [file, setFile] = useState<File | null>(null);              // Selected file
	const [dominantColorCount, setDominantColorCount] = useState(3); // Controls dominant() parameter
	const [colors, setColors] = useState<string[]>([]); // 保存从 kcppResult.colors 得到的转换后的hex数据
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null); // Track hovered color index

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = event.target.files?.[0];
		if (!selectedFile) return;
		if(selectedFile.size > 1024 * 1024 * 1){
			alert("文件大小超过1MB，请重新选择")
			return;
		}

		const objectUrl = URL.createObjectURL(selectedFile);
		const container = document.getElementById('origin-img');
		container?.setAttribute('src', objectUrl);

		setFile(selectedFile);

	};

	// Process Image Function
	const processImage = (selectedFile: File, colorCount: number) => {
		const img = new Image();
		img.src = URL.createObjectURL(selectedFile);

		img.onload = () => {
			const canvas = document.createElement('canvas');
			canvas.width = img.width;
			canvas.height = img.height;

			const ctx = canvas.getContext('2d');
			if (ctx) {
				ctx.drawImage(img, 0, 0);

				const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
				worker.postMessage({
					action: 'processImage',
					data: {
						imageData,
						colorCount
					}
				});

				worker.onmessage = (event) => {
					console.log("onmessage:"+event)
					const kcppResult = event.data as KCPP_result;
					const aaaa = new KCPP_result(kcppResult.kmpp_result, kcppResult.img_data);
					const clusteredImageDataURL = aaaa.get_clustered_dataurl();
					displayClusteredImage(clusteredImageDataURL);

					const hexColors = [];
					kcppResult.colors.map(color => {
						let rgb={};
						rgb.red=color[0];
						rgb.green=color[1];
						rgb.blue=color[2];
						let retColor = rgbToHexTemp(rgb)
						hexColors.push(retColor);
						console.log("kcppResult.colors.map:"+retColor)
					})
					// @ts-ignore
					setColors(hexColors); // 更新颜色数组
				};

				worker.onerror = (error) => {
					console.error('Worker error:', error);
				};
			}
		};

		img.onerror = (error) => {
			console.error('Failed to load image:', error);
		};
	};

	// Display Processed Image
	const displayClusteredImage = (dataurl: string) => {
		const container = document.getElementById('image-container');
		container?.setAttribute('src', dataurl);
	};

	// Copy color to clipboard
	// const copyToClipboard = (color: number[]) => {
	// 	console.log("copyToClipboard:"+color)
	// 	let rgb={};
	// 	rgb.red=color[0];
	// 	rgb.green=color[1];
	// 	rgb.blue=color[2];
	// 	let retColor = rgbToHexTemp(rgb)
	// 	console.log("copyToClipboard:"+retColor)
	//
	// 	// const rgbaString = `rgba(${color.join(',')})`;
	// 	navigator.clipboard.writeText(retColor).then(() => {
	// 		// alert(`Copied to clipboard: ${rgbaString}`);
	// 	}, (err) => {
	// 		console.error('Could not copy text: ', err);
	// 	});
	// };

	// Re-process image when dominantColorCount changes
	useEffect(() => {
		if (file) {
			processImage(file, dominantColorCount);
		}
	}, [dominantColorCount, file]);

	return (
		<div className="palette-app-container">
			<div style={{left: '50%',marginTop: '10px'}}>
				<input type="file" onChange={handleFileChange} style={{marginBottom: '10px'}}/>
			</div>
			<div style={{left: '50%', marginBottom: '20px'}}>
				<label>
					color count:
					<input
						type="number"
						value={dominantColorCount}
						onChange={(e) => setDominantColorCount(Number(e.target.value))}
						min={3} max={10} // Limit input range
					/>
				</label>
			</div>

			<div style={{float: 'left',marginRight: '10px'}}>
				<img style={{maxHeight: '250px'}} id="origin-img" alt="Uploaded File"/>
			</div>
			<div style={{float: 'left'}}>
				<img style={{maxHeight: '250px'}} id="image-container" alt="Processed File"/>
			</div>

			{colors.length > 0 && (
				<div className="color-palette">
					<h3>提取的主色</h3>
					<div className="color-squares">
						{colors.map((color, index) => (
							<div
								key={index}
								className="color-square"
								style={{
									backgroundColor: `#${color}`,
									position: 'relative',
									cursor: 'pointer'
								}}
								onMouseEnter={() => setHoveredIndex(index)}
								onMouseLeave={() => setHoveredIndex(null)}
								onClick={() => copyToClipboard(color)}
							>
								{hoveredIndex === index && (
									<div className="copy-icon">📋</div>
								)}
							</div>
						))}
					</div>
				</div>
			)}

		</div>
	);
};
