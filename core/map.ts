import { BehaviorSubject } from 'rxjs';
import { Coordinate } from 'src/app/core';

export interface MapData {
    image: HTMLImageElement;
    imageUrl: string;
    origin: Coordinate;
    resolution: number[];
    active?: boolean;
    isReady?: boolean;
}

export class MapFile {
    public resourceReadyState = new BehaviorSubject<boolean>(false);
    public layers: Array<MapData> = [];
    public name: String = '';

    private _nbLayersReady = 0;

    constructor(layers?: Array<MapData>, name?: String) {
        this.name = name;
        this.layers = layers;
        for (const layer of this.layers) {
            layer.isReady = false;

            layer.image.src = layer.imageUrl;
            layer.image.onload = () => {  
                this._nbLayersReady += 1;
                if (this._nbLayersReady == this.layers.length) {
                    this.resourceReadyState.next(true);
                }
            };
        }
    }
}

