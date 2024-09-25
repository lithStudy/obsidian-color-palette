import {KCPP} from "k-colors";

self.addEventListener('message', function(event) {
	debugger
	const selectedFile = event.data;

	const img = new Image();
	img.src = URL.createObjectURL(selectedFile);
	console.log("origin-img 渲染完成3")
	img.onload = () => {
		//占用大量的 CPU 资源，导致浏览器的其他任务（如渲染）会被推迟执行，因此会出现origin-img的图片实际上要等到这里计算出的图片同时展示的情况
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

	self.postMessage('CPU 密集型任务完成');
});
