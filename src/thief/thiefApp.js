import React, { useState, useEffect } from 'react';
import ColorThief from 'colorthief';
import ColorsRow from 'src/components/colors-row'
import {hexToNumber} from "../utils/utils";
import Color from "color";

import { InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';

const { Dragger } = Upload;

const ThiefApp = () => {

	const [mainColor, setMainColor] = useState([]);
	const [colorPalette,setColorPalette] = useState([]);
	const [selectedImage, setSelectedImage] = useState(null);

	const colorThief = new ColorThief();

	useEffect(() => {
		if (selectedImage) {
			extractColors(selectedImage);
		}
	}, [selectedImage]);

	const props = {
		name: 'file',
		multiple: true,
		// action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
		onChange(info) {
			const { status } = info.file;
			debugger
			if (status !== 'uploading') {
				console.log(info.file, info.fileList);
			}
			if (status === 'done') {
				const reader = new FileReader();
				reader.onload = (e) => {
					const img = new Image();
					img.src = e.target.result;
					img.onload = () => {
						setSelectedImage(img);
						// extractColors(img);
					};
				};
				reader.readAsDataURL(info.file.originFileObj);
			} else if (status === 'error') {
				console.log('Load failed');
			}


		},
		onDrop(e) {
			console.log('Dropped files', e.dataTransfer.files);
		},
	};


	const handleImageChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const img = new Image();
				img.src = e.target.result;
				img.onload = () => {
					setSelectedImage(img);
					// extractColors(img);
				};
			};
			reader.readAsDataURL(file);
		}
	};

	const extractColors = (img) => {
		const mainColorTemp = colorThief.getColor(img);
		const mainColorRgb = hexToNumber(Color(`rgb(${mainColorTemp[0]}, ${mainColorTemp[1]}, ${mainColorTemp[2]})`).hex())
		setMainColor(mainColorRgb);

		let paletteTemp = colorThief.getPalette(img);
		const colorsList = []
		paletteTemp.forEach(colorTemp => {
			colorsList.push(Color(`rgb(${colorTemp[0]}, ${colorTemp[1]}, ${colorTemp[2]})`).hex())
		})
		setColorPalette(colorsList);


	};



	return (
		<div>
			<div>
				<h1>Color Extractor</h1>
				<Dragger {...props}>
					<p className="ant-upload-drag-icon">
						<InboxOutlined/>
					</p>
					<p className="ant-upload-text">Click or drag file to this area to upload</p>
					<p className="ant-upload-hint">
						Support for a single or bulk upload. Strictly prohibited from uploading company data or other
						banned files.
					</p>
				</Dragger>

				{/*<input type="file" accept="image/*" onChange={handleImageChange}/>*/}

				{selectedImage && (
					<div style={{marginBottom: '20px'}}>
						<div>
							<img src={selectedImage.src} alt="Selected Image" style={{maxWidth: '500px'}}/>
						</div>
						<div>

						</div>

					</div>
				)}
				{mainColor.length > 0 && (
					<ColorsRow
						mainColor={mainColor}
						darkColors={[]}
						lightColors={colorPalette}
					/>
				)}

			</div>



		</div>
	);
};

export default ThiefApp;
