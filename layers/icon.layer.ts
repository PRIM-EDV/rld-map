import { Layer } from '../core/layer';
import { MapObject, BackendService } from '../backend/backend.service';

export class IconLayer extends Layer {
    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;
    private _backend: BackendService;
    private _icons: Array<HTMLImageElement> = [];
    private _iconUrls: Array<string> = [
        '/'
    ];

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, backend: BackendService) {
        super();
        
        this._canvas = canvas;
        this._ctx = ctx;
        this._backend = backend;

        for (const url of this._iconUrls) {
            this._icons.push(new Image());
            this._icons[this._icons.length - 1].src = url;
        }
    }

    public draw() {
        const mapObjects = this._backend.getMapObjects();

        for(let mapObject of mapObjects) {
            switch(mapObject.type) {
                case "object": {
                    this._drawObject(mapObject)    
                    break;
                }
            }    
        }
    }

    private _drawObject(obj: MapObject) {
        // this._ctx.drawImage(icon, ox, oy);
    }
}
