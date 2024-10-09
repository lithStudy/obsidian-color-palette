import { ItemView, WorkspaceLeaf } from "obsidian";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { DominantColorView } from "./src/DominantColorView";
import {TintShadeView} from "./src/TintShadeView"
import { createRoot } from "react-dom/client";
import 'src/styles/common.css';
import ColorWheel from "./src/ColorWheel";
import {ColorThiefView} from "./src/ColorThiefView";
import GalleryApp from "./src/components/gallery-app";
import App from "./src/scale/App";
import ScaleApp from "./src/scale/App"; // 引入公共CSS文件
import { PhotoshopPicker } from 'react-color'
export const VIEW_TYPE_EXAMPLE = "color-plate";

export class ExampleView extends ItemView {
	private root: any; // 存储 React 根实例
	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return VIEW_TYPE_EXAMPLE;
	}

	getDisplayText() {
		return "Example view";
	}

	async onOpen() {
		this.root = createRoot(this.containerEl.children[1]);
		this.root.render(
			<React.StrictMode>

				<ScaleApp/>
				{/*<ColorThiefView/>*/}
				{/*<TintShadeView/>*/}
				{/*<ColorWheel/>*/}

			</React.StrictMode>
		);
	}

	async onClose() {
		if (this.root) {
			this.root.unmount();
		}
		// ReactDOM.unmountComponentAtNode(this.containerEl.children[1]);
	}
}
