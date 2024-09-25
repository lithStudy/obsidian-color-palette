import * as React from "react";
import { KCPP } from 'k-colors';
import { useState, useEffect } from "react";

export const ReactView = () => {
	const [file, setFile] = useState(null);              // 已选文件
	const [dominantColorCount, setDominantColorCount] = useState(3); // 控制 dominant() 参数

	const handleFileChange = (event) => {
		const selectedFile = event.target.files[0];
		if (!selectedFile) return;


		const objectUrl = URL.createObjectURL(selectedFile);
		const container = document.getElementById('origin-img');
		console.log('container.src'+container)
		container.src = objectUrl;

		setFile(selectedFile)
	};

	// 处理图片函数
	const processImage = (selectedFile, colorCount) => {
		console.log("processImage："+selectedFile)
		try {

			const worker = new Worker('worker.js');

			worker.onmessage = (event) => {
				const container2 = document.getElementById('image-container');
				container2.src = URL.createObjectURL(selectedFile);
				console.log("origin-img 渲染完成2");
			};

			worker.postMessage(selectedFile);

			// const img = new Image();
			// img.src = URL.createObjectURL(selectedFile);
			// console.log("origin-img 渲染完成3")
			// img.onload = () => {
			// 	const worker = new Worker('worker.js');
			//
			// 	worker.onmessage = (event) => {
			// 		const container2 = document.getElementById('image-container');
			// 		container2.src = URL.createObjectURL(selectedFile);
			// 		console.log("origin-img 渲染完成2");
			// 	};
			//
			//
			// 	//占用大量的 CPU 资源，导致浏览器的其他任务（如渲染）会被推迟执行，因此会出现origin-img的图片实际上要等到这里计算出的图片同时展示的情况
			// 	const kcpp = new KCPP(img);
			// 	const result = kcpp.dominant(colorCount); // 动态设置 dominant 参数
			// 	const imageData = result.get_clustered_dataurl();
			// 	console.log(result.colors);
			//
			// 	displayClusteredImage(imageData);
			//
			// 	// 清理对象 URL，只清理 img 使用的 URL
			// 	URL.revokeObjectURL(img.src);
			// };
			//
			// img.onerror = (error) => {
			// 	console.error('Failed to load image:', error);
			// };
		} catch (error) {
			console.error('Error processing file:', error);
		}
	};

	// 显示处理后的图片
	const displayClusteredImage = (dataurl) => {
		const container = document.getElementById('image-container');
		container.src = dataurl;
		console.log("origin-img 渲染完成4")
	};

	// 当 dominantColorCount 变化时，如果存在已选文件和预览 URL，则重新处理图片
	useEffect(() => {
		if (file) {
			// 重新处理图片，并确保当前 URL 还有效
			processImage(file, dominantColorCount);
		}
	}, [dominantColorCount, file]);

	// useEffect(() => {
	// 	if (file) {
	// 		const objectUrl = URL.createObjectURL(file);
	// 		const container = document.getElementById('origin-img');
	// 		console.log('container.src'+container.src)
	// 		container.src = objectUrl;
	// 	}
	// }, [file]);

	return (
		<div className="App">
			<h1>File Upload Example</h1>
			<input type="file" onChange={handleFileChange}/>

			{file && (
				<p>Selected file: {file.name}</p>
			)}
			<div>
				<img id="origin-img" alt="Uploaded File"/>
			</div>

			<label>
				Dominant Color Count:
				<input
					type="number"
					value={dominantColorCount}
					onChange={(e) => setDominantColorCount(Number(e.target.value))}
					min={3} max={10} // 限制输入范围
				/>
			</label>

			<img id="image-container" alt="Processed File"/>
		</div>
	);
};
