import { KCPP } from 'k-colors';
import {KCPP_result} from "k-colors/kcpp";

self.onmessage = (event) => {
	const { action, data } = event.data;

	if (action === 'processImage') {
		const { imageData, colorCount } = data;

		// const offscreenCanvas = new OffscreenCanvas(imageData.width, imageData.height);
		// console.log("offscreenCanvas:"+offscreenCanvas)
		// const ctx = offscreenCanvas.getContext('2d');
		// console.log("ctx:"+ctx)
		// ctx.putImageData(imageData, 0, 0);
		//
		// const imgElement = offscreenCanvas.transferToImageBitmap();
		// debugger
		// console.log("imgElement:"+imgElement)

		const kcpp = new KCPP(imageData);
		console.log("kcpp:"+kcpp)
		const result = kcpp.dominant(colorCount);
		console.log("result:"+result)
		// debugger
		// const clusteredImageDataURL = result.get_clustered_dataurl();
		// console.log("postMessage:"+clusteredImageDataURL)
		self.postMessage(result);
	}
};
