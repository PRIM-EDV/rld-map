import { Layer } from './layer';
import { MapObject, BackendService } from '../backend/backend.service';

export class IconLayer extends Layer {
    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;
    private _backend: BackendService;

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, backend: BackendService) {
        super();
        
        this._canvas = canvas;
        this._ctx = ctx;
        this._backend = backend;
    }

    public draw() {
        const mapObjects = this._backend.getMapObjects();

        for(let mapObject of mapObjects) {
            
        }
    }
}
