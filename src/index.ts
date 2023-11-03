import { $, createCanvas } from "./lib/util";
import { expect } from "./lib/option";

const TILE_SIZE = 64;

async function main(): Promise<void> {
	const { canvas, ctx } = expect(
		createCanvas(512, 512),
		"Could not create playfield canvas"
	);
	expect(
		$("pfcontainer"),
		"Could not insert playfield canvas into DOM"
	).appendChild(canvas);

	// Main loop
	function frame(): void {
		for (let x = 0; x < 16; x++) {
			for (let y = 0; y < 16; y++) {
				if ((x + y) % 2 === 0) {
					ctx.fillStyle = "white";
				} else {
					ctx.fillStyle = "black";
				}
				ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
			}
		}

		requestAnimationFrame(frame);
	}
	requestAnimationFrame(frame);
}

document.addEventListener("DOMContentLoaded", main);

// TODO:
class GameBoard {}
