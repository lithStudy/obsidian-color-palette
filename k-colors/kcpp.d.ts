import { Result, Points, k_means_type } from 'k-means-pp';
import type { Colors, I_KCPP_result_data } from './types';
/**
 * KCPP (K-Colors Plus Plus)
 *
 * This class provides methods to extract the k most dominant colors from an image
 * using k-means and k-means++ clustering algorithms.
 */
export declare class KCPP {
    private readonly kmpp;
    private readonly img_data;
    constructor(img_data: HTMLImageElement | OffscreenCanvas | HTMLCanvasElement | ImageData);
    /**
     * Calculates k dominant colors using the k-means or k-means++ algorithm
     * @param k The number of colors to extract
     * @returns An object containing the KMPP result and rounded color values
     */
    dominant(k: number, algorithm?: k_means_type): KCPP_result;
}
export declare class KCPP_result implements I_KCPP_result_data {
    readonly kmpp_result: Result | Points;
    readonly img_data;
    readonly colors: Colors;
    constructor(kmpp_result: Result | Points, img_data: ImageData);
    /** Returns the image data with the clustered colors */
    get_clustered_image_data(): ImageData;
    /** Returns the data url of the image with the clustered colors */
    get_clustered_dataurl(): string;
}
