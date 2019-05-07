import { Coordinate } from '../backend/utils/coordinate.util';

export interface MapData {
    image: HTMLImageElement;
    imageUrl: string;
    origin: Coordinate;
    resolution: number[];
    active?: boolean;
    isReady?: boolean;
}

export class MapFile {
    public layers: Array<MapData> = [];
    public name: String = '';

    constructor(layers?: Array<MapData>, name?: String) {
        this.name = name;
        this.layers = layers;
        for (const layer of this.layers) {
            layer.isReady = false;

            layer.image.src = layer.imageUrl;
            layer.image.onload = () => { layer.isReady = true; console.log('Loaded.'); };
        }
    }

    public get isReady() {
        for (const layer of this.layers) {
            if (!layer.isReady) {
                return false;
            }
        }

        return true;
    }
}

