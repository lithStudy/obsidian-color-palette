import * as React from "react";
import { KCPP } from 'k-colors';
import { useState, useEffect } from "react";

export const ReactView = () => {
	const [file, setFile] = useState(null);              // 已选文件
	const [previewUrl, setPreviewUrl] = useState(null);  // 图片预览 URL
	const [dominantColorCount, setDominantColorCount] = useState(3); // 控制 dominant() 参数

	const handleFileChange = (event) => {
		const selectedFile = event.target.files[0];
		if (!selectedFile) return;

		setFile(selectedFile);
		const objectUrl = URL.createObjectURL(selectedFile);
		setPreviewUrl(objectUrl);

		// 首次处理图片
		processImage(selectedFile, objectUrl, dominantColorCount);
	};

	// 处理图片函数
	const processImage = (selectedFile, objectUrl, colorCount) => {
		try {
			const img = new Image();
			img.src = objectUrl;

			img.onload = () => {
				const kcpp = new KCPP(img);
				const result = kcpp.dominant(colorCount); // 动态设置 dominant 参数
				const imageData = result.get_clustered_dataurl();
				console.log(result.colors);

				displayClusteredImage(imageData);

				// 清理对象 URL，只清理 img 使用的 URL
				URL.revokeObjectURL(img.src);
			};

			img.onerror = (error) => {
				console.error('Failed to load image:', error);
			};
		} catch (error) {
			console.error('Error processing file:', error);
		}
	};

	// 显示处理后的图片
	const displayClusteredImage = (dataurl) => {
		const container = document.getElementById('image-container');
		container.src = dataurl;
	};

	// 当 dominantColorCount 变化时，如果存在已选文件和预览 URL，则重新处理图片
	useEffect(() => {
		if (file && previewUrl) {
			// 重新处理图片，并确保当前 URL 还有效
			processImage(file, previewUrl, dominantColorCount);
		}
	}, [dominantColorCount, file, previewUrl]);

	// 在组件卸载时，清理 previewUrl
	useEffect(() => {
		return () => {
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl); // 清理 preview URL
			}
		};
	}, [previewUrl]);

	return (
		<div className="App">
			<h1>File Upload Example</h1>
			<input type="file" onChange={handleFileChange} />

			{file && (
				<div>
					<p>Selected file: {file.name}</p>
					<img src={previewUrl} alt="Uploaded File" />
				</div>
			)}

			<label>
				Dominant Color Count:
				<input
					type="number"
					value={dominantColorCount}
					onChange={(e) => setDominantColorCount(Number(e.target.value))}
					min={1} max={10} // 限制输入范围
				/>
			</label>

			<img id="image-container" alt="Processed File" />
		</div>
	);
};
