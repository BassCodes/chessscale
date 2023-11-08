import { SpriteSlicer } from "./lib/spriteSlicer";
import { loadImage, Image } from "./lib/util";

interface Textures {
	pieces: Array<Image>;
	initialized: boolean;
	init: () => Promise<void>;
}

const TextureStore: Textures = {
	pieces: [],
	initialized: false,
	async init(): Promise<void> {
		if (this.initialized) {
			throw new Error("Cannot load textures twice...");
		}
		this.pieces = SpriteSlicer.slice(
			await loadImage("./chess_sprites.png"),
			[64, 64]
		);
		this.initialized = true;
	},
};

export default TextureStore;
