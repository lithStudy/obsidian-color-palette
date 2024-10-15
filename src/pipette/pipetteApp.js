import React, { useState, useEffect } from 'react';
import ColorThief from 'colorthief';
import ColorsRow from 'src/components/colors-row'
import {hexToNumber} from "../utils/utils";
import Color from "color";
import 'src/styles/common.css'
import { Upload } from 'antd';



const { Dragger } = Upload;
const PipetteApp = () => {

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
		multiple: false,
		accept:'image',
		showUploadList:false,
		// action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
		onChange(info) {
			const { status } = info.file;
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
				<Dragger {...props} style={{marginBottom: '20px'}} className="DotsWrapper">
					<span role="img" aria-label="inbox" style={{fontSize: '20px',color:'#233CD6'}}>
						<svg viewBox="0 0 1024 1024"
						   focusable="false"
						   data-icon="inbox"
						   width="1em" height="1em"
						   fill="currentColor"
						   aria-hidden="true">
							<path d="M885.2 446.3l-.2-.8-112.2-285.1c-5-16.1-19.9-27.2-36.8-27.2H281.2c-17 0-32.1 11.3-36.9 27.6L139.4 443l-.3.7-.2.8c-1.3 4.9-1.7 9.9-1 14.8-.1 1.6-.2 3.2-.2 4.8V830a60.9 60.9 0 0060.8 60.8h627.2c33.5 0 60.8-27.3 60.9-60.8V464.1c0-1.3 0-2.6-.1-3.7.4-4.9 0-9.6-1.3-14.1zm-295.8-43l-.3 15.7c-.8 44.9-31.8 75.1-77.1 75.1-22.1 0-41.1-7.1-54.8-20.6S436 441.2 435.6 419l-.3-15.7H229.5L309 210h399.2l81.7 193.3H589.4zm-375 76.8h157.3c24.3 57.1 76 90.8 140.4 90.8 33.7 0 65-9.4 90.3-27.2 22.2-15.6 39.5-37.4 50.7-63.6h156.5V814H214.4V480.1z"></path>
						</svg>
					</span>
					<p style={{marginBottom: '0px',marginTop: '0px'}}>点击或拖拽图片</p>
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

export default PipetteApp;
