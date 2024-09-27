import { KMPP } from "k-means-pp";
import { get_image_data } from "./utils";
class KCPP {
  constructor(img_data) {
    this.img_data = get_image_data(img_data);
    this.kmpp = new KMPP({
      data: get_colors(this.img_data),
      dimension: 4
    });
  }
  /** 
   * Calculates k dominant colors using the k-means or k-means++ algorithm
   * @param k The number of colors to extract
   * @returns An object containing the KMPP result and rounded color values
   */
  dominant(k, algorithm = "k_means_pp") {
    return new KCPP_result(this.kmpp.cluster(k, algorithm), this.img_data);
  }
}
function round_result(raw_colors) {
  return raw_colors.map((color) => color.map((c) => Math.round(c)));
}
function get_colors(image_data) {
  const data = image_data.data;
  const colors = [];
  for (let i = 0; i < data.length; i += 4) {
    colors.push([data[i], data[i + 1], data[i + 2], data[i + 3]]);
  }
  return colors;
}
class KCPP_result {
  constructor(kmpp_result, img_data) {
    this.kmpp_result = kmpp_result;
    this.img_data = img_data;
    const means = kmpp_result instanceof Array ? kmpp_result : kmpp_result.means;
    this.colors = round_result(means);
  }
  /** Returns the image data with the clustered colors */
  get_clustered_image_data() {
    if (this.kmpp_result instanceof Array)
      return this.img_data;
    const data = new Uint8ClampedArray(this.img_data.width * this.img_data.height * 4);
    this.kmpp_result.clusters.forEach((cluster) => {
      cluster.points.forEach((el) => {
        data[el.index * 4] = cluster.mean[0];
        data[el.index * 4 + 1] = cluster.mean[1];
        data[el.index * 4 + 2] = cluster.mean[2];
        data[el.index * 4 + 3] = cluster.mean[3];
      });
    });
    return new ImageData(data, this.img_data.width, this.img_data.height);
  }
  /** Returns the data url of the image with the clustered colors */
  get_clustered_dataurl() {
    const canvas = document.createElement("canvas");
    canvas.width = this.img_data.width;
    canvas.height = this.img_data.height;
    const ctx = canvas.getContext("2d");
    ctx.putImageData(this.get_clustered_image_data(), 0, 0);
    return canvas.toDataURL();
  }
}
export {
  KCPP,
  KCPP_result
};
