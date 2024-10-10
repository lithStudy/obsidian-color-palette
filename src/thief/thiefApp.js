import React, { useState, useEffect } from 'react';
import ColorThief from 'colorthief';

const ThiefApp = () => {
	const [colorArr, setColorArr] = useState([]);
	const [selectedImage, setSelectedImage] = useState(null);

	const colorThief = new ColorThief();

	const handleImageChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const img = new Image();
				img.src = e.target.result;
				img.onload = () => {
					setSelectedImage(img);
					extractColors(img);
				};
			};
			reader.readAsDataURL(file);
		}
	};

	const extractColors = (img) => {
		const colors = colorThief.getColor(img);
		setColorArr(colors);
	};

	useEffect(() => {
		if (selectedImage) {
			extractColors(selectedImage);
		}
	}, [selectedImage]);

	return (
		<div>
			<h1>Color Extractor</h1>
			<input type="file" accept="image/*" onChange={handleImageChange} />
			{selectedImage && (
				<img src={selectedImage.src} alt="Selected Image" style={{ maxWidth: '100%' }} />
			)}
			{colorArr.length > 0 && (
				<div>
					<h2>Extracted Colors:</h2>
					<p>{JSON.stringify(colorArr)}</p>
				</div>
			)}
		</div>
	);
};

export default ThiefApp;
