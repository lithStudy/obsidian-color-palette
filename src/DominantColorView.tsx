import * as React from "react";
import { useState, useEffect } from "react";
import MyWorker from 'src/woker/myworker.worker';
import {KCPP_result} from "k-colors"; // Make sure this path is correct
import {copyToClipboard, rgbToHexTemp} from "src/utils/colorUtil";
import imageCompression from 'browser-image-compression';

const worker = new MyWorker();

export const DominantColorView = () => {
	const [file, setFile] = useState<File | null>(null);              // Selected file
	const [dominantColorCount, setDominantColorCount] = useState(5); // Controls dominant() parameter
	const [colors, setColors] = useState<string[]>([]); // 保存从 kcppResult.colors 得到的转换后的hex数据
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null); // Track hovered color index
	const [orginUrl,setOriginUrl] = useState<string>()
	const [dominantUrl,setDominantUrl] = useState<string>()
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

		// const objectUrl = URL.createObjectURL(selectedFile);
		// setOriginUrl(objectUrl)
		//
		// setFile(selectedFile);

	};

	// Process Image Function
	const processImage = (selectedFile: File, colorCount: number) => {
		setLoading(true)

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
					setDominantUrl(clusteredImageDataURL)
					// displayClusteredImage(clusteredImageDataURL);

					const hexColors: any[] | ((prevState: string[]) => string[]) = [];
					kcppResult.colors.map(color => {
						let rgb:{red:number,blue:number,green:number}={
							red:color[0],
							green:color[1],
							blue:color[2]
						};
						// rgb.red=color[0];
						// rgb.green=color[1];
						// rgb.blue=color[2];
						let retColor = rgbToHexTemp(rgb)
						hexColors.push(retColor);
						console.log("kcppResult.colors.map:"+retColor)
					})
					// @ts-ignore
					setColors(hexColors); // 更新颜色数组

					setLoading(false)
				};

				worker.onerror = (error) => {
					console.error('Worker error:', error);
					setLoading(false)
				};
			}
		};

		img.onerror = (error) => {
			console.error('Failed to load image:', error);
			setLoading(false)
		};
	};

	// Display Processed Image
	const displayClusteredImage = (dataurl: string) => {
		const container = document.getElementById('image-container');
		container?.setAttribute('src', dataurl);
	};

	// Re-process image when dominantColorCount changes
	useEffect(() => {
		if (file) {
			processImage(file, dominantColorCount);
		}
	}, [dominantColorCount, file]);

	return (
		<div className="palette-app-container">
			<h3>提取主色</h3>
			<div style={{left: '50%',marginTop: '10px'}}>
				<input type="file" accept="image/*" onChange={handleFileChange} style={{marginBottom: '10px',cursor: 'pointer'}}/>
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
			{loading && (
				<h5>处理中...</h5>
			)}
			{orginUrl && (
				<div style={{float: 'left', marginRight: '10px'}}>
					<img style={{maxHeight: '300px'}} id="origin-img" alt="Uploaded File" src={orginUrl}/>
				</div>
			)}
			{dominantUrl && (
				<div style={{float: 'left'}}>
					<img style={{maxHeight: '300px'}} id="image-container" alt="Processed File" src={dominantUrl}/>
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
