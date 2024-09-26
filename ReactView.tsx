import * as React from "react";
import { useState, useEffect } from "react";
import MyWorker from 'myworker.worker';
import {KCPP_result} from "k-colors"; // Make sure this path is correct

const worker = new MyWorker();

export const ReactView = () => {
	const [file, setFile] = useState<File | null>(null);              // Selected file
	const [dominantColorCount, setDominantColorCount] = useState(3); // Controls dominant() parameter

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = event.target.files?.[0];
		if (!selectedFile) return;

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
					const aaaa =new KCPP_result(kcppResult.kmpp_result, kcppResult.img_data)
					const clusteredImageDataURL = aaaa.get_clustered_dataurl();
					displayClusteredImage(clusteredImageDataURL);
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

	// Re-process image when dominantColorCount changes
	useEffect(() => {
		if (file) {
			processImage(file, dominantColorCount);
		}
	}, [dominantColorCount, file]);

	return (
		<div className="App">
			<h1>File Upload Example</h1>
			<input type="file" onChange={handleFileChange}/>
			<label>
				Dominant Color Count:
				<input
					type="number"
					value={dominantColorCount}
					onChange={(e) => setDominantColorCount(Number(e.target.value))}
					min={3} max={10} // Limit input range
				/>
			</label>
			{file && (
				<p>Selected file: {file.name}</p>
			)}

			<div>
				<img id="origin-img" alt="Uploaded File"/>
			</div>


			<img id="image-container" alt="Processed File"/>
		</div>
	);
};
