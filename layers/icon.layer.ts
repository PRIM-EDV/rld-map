import { Layer } from '../core/layer';
import { MapObject, BackendService } from '../backend/backend.service';
import { Coordinate } from '../backend/utils/coordinate.util';

export class IconLayer extends Layer {
    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;
    private _backend: BackendService;
    private _icons: Array<HTMLImageElement> = [];
    private _iconUrls: Array<string> = [
        'assets/icons/marker_object.png'
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
        console.log(mapObjects);
        for(let mapObject of mapObjects) {
            switch(mapObject.type) {
                case "object": {
                    this._drawObject(mapObject)    
                    break;
                }
            }    
        }
    }

    public onClick(pos: {x: number, y: number}) {
        
    }

    private _drawObject(obj: MapObject) {
        this._icons[0].style.width = "48px";
        this._icons[0].style.height = "48px";
        this._icons[0].width = 48;
        this._icons[0].height = 48;
        this._ctx.drawImage(this._icons[0],0, 0, 48, 48, obj.coord.inCanvas.x - 24, obj.coord.inCanvas.y - 24, 48, 48);
    }
}
