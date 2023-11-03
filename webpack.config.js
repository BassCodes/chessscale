const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

const config = {
	entry: "./src/index.ts",
	plugins: [
		new CopyPlugin({
			patterns: [
				{ from: "src/assets", to: "" },
				{ from: "src/images", to: "" },
			],
		}),
	],

	module: {
		rules: [
			{
				test: /\.ts$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
			{
				test: /\.html/,
				type: "asset/resource"         
			}
		],
	},
	resolve: {
		extensions: [".ts"],
	},
	output: {
		filename: "main.js",
		path: path.resolve(__dirname, "dist"),
	},
};
module.exports = (env, argv) => {
	if (argv.mode === "development") {
		config.devtool = "source-map";
	}

	if (argv.mode === "production") {
	}

	return config;
};