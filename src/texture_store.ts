import { SpriteSlicer } from "./lib/spriteSlicer";
import { loadImage, Image } from "./lib/util";

// export class TextureStore {
// 	readonly pieces: Array<Image>;
// 	// Private constructor which is only called by the `new()` method because constructors cannot be async.
// 	// Using `await TextureStore.new()` is a somewhat clean workaround.
// 	private constructor(pieces: Array<Image>) {
// 		this.pieces = pieces;
// 	}
// 	static async new(): Promise<TextureStore> {
// 		const colors = SpriteSlicer.slice(
// 			await loadImage("./chess_sprites.png"),
// 			[64, 64]
// 		);

// 		return new TextureStore(colors);
// 	}
// }

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
