import {ItemView, WorkspaceLeaf} from "obsidian";
import * as React from "react";
import {createRoot} from "react-dom/client";
import 'src/styles/common.css';
import PipetteApp from "./pipetteApp";

export const VIEW_TYPE_COLOR_PALETTE_THIEF = "color-pipette";

export class PipetteView extends ItemView {
	private root: any; // 存储 React 根实例
	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return VIEW_TYPE_COLOR_PALETTE_THIEF;
	}

	getDisplayText() {
		return "pipette";
	}

	async onOpen() {
		this.root = createRoot(this.containerEl.children[1]);
		this.root.render(
			<React.StrictMode>
				<PipetteApp/>
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
