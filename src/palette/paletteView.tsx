import {ItemView, WorkspaceLeaf} from "obsidian";
import * as React from "react";
import {createRoot} from "react-dom/client";
import 'src/styles/common.css';
import PaletteApp from "./paletteApp";

export const VIEW_TYPE_COLOR_PALETTE_SCALE = "color-palette";

export class PaletteView extends ItemView {
	private root: any; // 存储 React 根实例
	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return VIEW_TYPE_COLOR_PALETTE_SCALE;
	}

	getDisplayText() {
		return "Palette";
	}

	async onOpen() {
		this.root = createRoot(this.containerEl.children[1]);
		this.root.render(
			<React.StrictMode>
				<PaletteApp/>
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
