// Split a tiled spritesheet image into many different images.
// Useful to reduce http requests from loading many tiny images.

import { unwrap } from "./util.js";

export abstract class SpriteSlicer {
	static slice(
		spriteSheet: HTMLImageElement,
		tileSize: [number, number]
	): Array<HTMLImageElement> {
		const canvas = unwrap(document.createElement("canvas"));
		canvas.style.display = "none";
		[canvas.width, canvas.height] = tileSize;
		document.body.appendChild(canvas);
		const ctx = unwrap(canvas.getContext("2d"));
		const tiles = [];
		const tilesWide = spriteSheet.width / tileSize[0];
		const tilesTall = spriteSheet.height / tileSize[1];
		for (let y = 0; y < tilesTall; y++) {
			for (let x = 0; x < tilesWide; x++) {
				ctx.drawImage(spriteSheet, -x * tileSize[0], -y * tileSize[1]);
				const tmp = new Image(...tileSize);
				tmp.src = canvas.toDataURL();
				ctx.clearRect(0, 0, ...tileSize);
				tiles.push(tmp);
			}
		}
		canvas.remove();
		return tiles;
	}
}
