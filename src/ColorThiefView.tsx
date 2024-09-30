import * as React from "react";
import { useState, useEffect } from "react";
import {copyToClipboard, rgbToHexTemp} from "src/utils/colorUtil";
import imageCompression from 'browser-image-compression';
import ColorThief from 'colorthief/dist/color-thief.mjs'

const colorThiefView = new ColorThief();

export const ColorThiefView = () => {
	const [file, setFile] = useState<File | null>(null);              // Selected file
	const [colors, setColors] = useState<string[]>([]); // 保存从 kcppResult.colors 得到的转换后的hex数据
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null); // Track hovered color index
	const [orginUrl,setOriginUrl] = useState<string>()
	const [loading, setLoading] = useState(false)

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = event.target.files?.[0];
		if (!selectedFile) return;
		//如果文件类型不是图片，提示并返回
		if (selectedFile.type.indexOf('image') === -1) {
			alert("请选择图片文件");
			return;
		}
		// if (selectedFile.size > 1024 * 1024 * 1) {
		// 	alert("文件大小超过1MB，请重新选择")
		// 	return;
		// }

		try {
			// Compress the image before using it
			const options = {
				maxSizeMB: 1,             // Max file size in MB
				maxWidthOrHeight: 512,   // Max width or height
				useWebWorker: true        // Use web worker for processing
			};
			const compressedFile = await imageCompression(selectedFile, options);
			console.log("selectedFile.size:" + selectedFile.size);
			console.log("compressedFile.size:" + compressedFile.size);
			// Generate object URL for the compressed image
			const objectUrl = URL.createObjectURL(compressedFile);
			setOriginUrl(objectUrl);



			// Set the compressed file to state
			setFile(compressedFile);
		} catch (error) {
			console.error("Error compressing the image:", error);
		}

	};

	// Process Image Function
	const processImage = async (selectedFile: File) => {
		setLoading(true);

		const img = document.getElementById('origin-img') as HTMLImageElement;

		// Use Promise to handle asynchronous loading of the image
		const loadImage = new Promise<void>((resolve) => {
			if (img.complete) {
				resolve();
			} else {
				img.addEventListener('load', () => resolve());
			}
		});

		await loadImage;

		try {
			// Extract dominant color(s) from the image
			const dominantColor = colorThiefView.getColor(img);
			const palette = colorThiefView.getPalette(img, 5); // Get a palette of 5 colors
			debugger
			setColors(palette.map(color => rgbToHexTemp(color))); // Assuming rgbToHexTemp converts RGB to HEX
		} catch (error) {
			console.error("Error processing the image:", error);
		} finally {
			setLoading(false);
		}
	};

	// Re-process image
	useEffect(() => {
		if (file) {
			processImage(file);
		}
	}, [file]);

	return (
		<div className="palette-app-container">
			<h3>Dominant Colors</h3>
			<div style={{left: '50%',marginTop: '10px'}}>
				<input type="file" accept="image/*" onChange={handleFileChange} style={{marginBottom: '10px',cursor: 'pointer'}}/>
			</div>
			{loading && (
				<h5>处理中...</h5>
			)}
			{orginUrl && (
				<div style={{float: 'left', marginRight: '10px'}}>
					<img style={{maxHeight: '300px'}} id="origin-img" alt="Uploaded File" src={orginUrl}/>
				</div>
			)}


			{colors.length > 0 && (
				<div className="color-palette">
					<div className="shade-squares">
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
