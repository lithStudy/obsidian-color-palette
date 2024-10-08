import esbuild from "esbuild";
import process from "process";
import builtins from "builtin-modules";
import inlineWorkerPlugin from "esbuild-plugin-inline-worker";
import * as fs from "fs";
import postcss from 'esbuild-postcss';

const banner =
`/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/
`;

const prod = (process.argv[2] === "production");

const context = await esbuild.context({
	banner: {
		js: banner,
	},
	entryPoints: ["main.ts"],
	bundle: true,
	plugins: [
		inlineWorkerPlugin(),
		// postcss({
		// 	plugins: [],
		// 	inject: ['src/styles/common.css'], // 注入公共 CSS 文件
		// }),
	],
	loader: {
		'.js': 'jsx',
		'.css': 'css', // 加载CSS文件
	},
	external: [
		"obsidian",
		"electron",
		"@codemirror/autocomplete",
		"@codemirror/collab",
		"@codemirror/commands",
		"@codemirror/language",
		"@codemirror/lint",
		"@codemirror/search",
		"@codemirror/state",
		"@codemirror/view",
		"@lezer/common",
		"@lezer/highlight",
		"@lezer/lr",
		...builtins],
	format: "cjs",
	target: "es2018",
	logLevel: "info",
	sourcemap: prod ? false : "inline",
	treeShaking: true,
	outfile: "main.js",
	minify: prod,
});

if (prod) {
	await context.rebuild();
	fs.rename("main.css", "styles.css", (err) => {
		if (err) {
			throw err;
		}
	});
	process.exit(0);
} else {
	await context.watch();
	fs.watchFile("main.css", () => {
		fs.access("main.css", fs.constants.F_OK, (err) => {
			if (!err) {
				fs.rename("main.css", "styles.css", (err) => {
					if (err) {
						throw err;
					}
				});
			}
		});
	});
}
