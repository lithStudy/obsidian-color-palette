function get_image_data(canvas) {
  if (canvas instanceof ImageData)
    return canvas;
  var ctx;
  if (canvas instanceof HTMLImageElement) {
    const img = canvas;
    canvas = new OffscreenCanvas(img.width, img.height);
    ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
  } else {
    ctx = canvas.getContext("2d");
  }
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}
export {
  get_image_data
};
