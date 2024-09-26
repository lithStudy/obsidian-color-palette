import * as React from "react";
import { useState, useEffect } from "react";
import MyWorker from 'myworker.worker';
import {KCPP_result} from "k-colors"; // Make sure this path is correct
import {createTintsAndShadesTemp} from "utils/colorUtil"

const worker = new MyWorker();

export const DominantColorView = () => {
	const [file, setFile] = useState<File | null>(null);              // Selected file
	const [dominantColorCount, setDominantColorCount] = useState(3); // Controls dominant() parameter
	const [colors, setColors] = useState<number[][]>([]); // 保存从 kcppResult.colors 得到的 RGBA 数组

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

					// @ts-ignore
					setColors(kcppResult.colors); // 更新颜色数组
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
									backgroundColor: `rgba(${color.join(',')})`
								}}
							></div>
						))}
					</div>
				</div>
			)}

			<div id="tints-and-shades">

			</div>

			<style jsx>{`
				.app-container {
					font-family: Arial, sans-serif;
					padding: 20px;
				}

				h1, h2,h3 {
					text-align: center;
				}

				.file-input {
					display: block;
					margin: 20px auto;
				}

				.color-count-input {
					display: block;
					margin: 10px auto;
					width: 50px;
				}

				.image-section {
					display: flex;
					justify-content: space-around;
					margin-top: 20px;
				}

				.image-display {
					max-width: 300px;
					max-height: 300px;
					border: 1px solid #ccc;
					margin-top: 10px;
				}

				.color-palette {
					margin-top: 30px;
					//text-align: left;
					width: 100%;
					float: left;
				}
				

				.color-squares {
					display: flex;
					//justify-content: center;
					flex-wrap: wrap;
				}

				.color-square {
					width: 50px;
					height: 50px;
					margin: 5px;
					border: 1px solid #000;
				}
				
				.hex-color{
					height: 40px;
				}
			`}</style>


		</div>
	);
};
