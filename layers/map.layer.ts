import { Layer } from '../core/layer';
import { MapFile } from '../utils/map.util';
import { Coordinate } from '../backend/utils/coordinate.util';
import { Direction } from '../backend/utils/direction.util';

export class MapLayer extends Layer {
    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;
    private _mapfile: MapFile = null;
    private _viewport: Direction = new Direction();

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, mapfile: MapFile) {
        super();

        this._canvas = canvas;
        this._ctx = ctx;
        this._mapfile = mapfile;
    }

    public draw() {
        this._viewport.inPixel = {x: this._canvas.width, y: this._canvas.height};
        for (const map of this._mapfile.layers) {
            if (map.active) {
                this._ctx.drawImage(map.image, Coordinate.offset.x, Coordinate.offset.y, this._viewport.inCanvas.x, this._viewport.inCanvas.y, 0, 0, this._canvas.width, this._canvas.height);
            }
        }
    }

    public onPan(e: HammerInput, offset: {x: number, y: number}) {
        if (e.maxPointers === 1) {
            Coordinate.offset = {
                x: offset.x - e.deltaX * Coordinate.scale, // Math.max(Math.min(0, this.mx), Math.min(Math.max(0, this.mx), offset.x - e.deltaX * Coordinate.scale)),
                y: offset.y - e.deltaY * Coordinate.scale// Math.max(Math.min(0, this.my), Math.min(Math.max(0, this.my), offset.y - e.deltaY * Coordinate.scale
            };
        }
    }

    public onPinch(e: HammerInput, pinch: number, center: {x: number, y: number}, offset: {x: number, y: number}) {
        Coordinate.scale = pinch * (1 / e.scale);
        Coordinate.offset = {
            x: offset.x - (center.x * (Coordinate.scale - pinch)),
            y: offset.y - (center.y * (Coordinate.scale - pinch))
        };
    }

    public onScroll(e: WheelEvent) {
        const scale = Coordinate.scale;
        Coordinate.scale = scale * (1 + e.deltaY / 1000);
        Coordinate.offset = {
            x: Coordinate.offset.x - (e.x * (Coordinate.scale - scale)),
            y: Coordinate.offset.y - (e.y * (Coordinate.scale - scale))
        };
    }
}
