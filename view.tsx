import { ItemView, WorkspaceLeaf } from "obsidian";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { DominantColorView } from "./src/DominantColorView";
import {TintShadeView} from "./src/TintShadeView"
import { createRoot } from "react-dom/client";

export const VIEW_TYPE_EXAMPLE = "example-view";

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
				<DominantColorView />,
				<TintShadeView/>,
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
