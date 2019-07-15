import { Layer } from '../core/layer';
import { MapObject, BackendService } from '../backend/backend.service';
import { Coordinate } from '../backend/utils/coordinate.util';
import { ContextMenuService } from '../context-menu/context-menu.service';

export class IconLayer extends Layer {
    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;
    private _contextMenuService: ContextMenuService;
    private _backend: BackendService;
    private _draggedMapObject: MapObject = null;
    private _icons: Array<HTMLImageElement> = [];
    private _iconUrls: Array<string> = [
        'assets/icons/marker_object.png'
    ];
    private _position = {x: 0, y:0};

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, backend: BackendService, contextMenuService: ContextMenuService) {
        super();
        
        this._canvas = canvas;
        this._contextMenuService = contextMenuService;
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

    public onContextMenu(e: MouseEvent): boolean {
        const mapObjects = this._backend.getMapObjects();
        const offset = this._canvas.getBoundingClientRect();

        for (let object of mapObjects) {
            if (this._isInBoundingBox(object, {x: e.x - offset.left, y: e.y - offset.top})) {
                const position = {x: object.coord.inCanvas.x + offset.left, y: object.coord.inCanvas.y + offset.top}
                this._contextMenuService.wheelMenu.editObjectContext.open(position);
                return false;
            } 
        }

        return true;
    }

    public onPanStart(e: HammerInput) {
        const mapObjects = this._backend.getMapObjects();
        
        this._position = { x: e.center.x - e.target.getBoundingClientRect().left, y: e.center.y - e.target.getBoundingClientRect().top}
        mapObjects.forEach(object => {
            if (this._isInBoundingBox(object, this._position)) {
                this._draggedMapObject = object;
                return false;
            } else {
                return true;
            }
        });
    }

    public onPan(e: HammerInput, offset: {x: number, y: number}): boolean {
        if (this._draggedMapObject != null) {
            this._draggedMapObject.coord.inCanvas = {x: this._position.x + e.deltaX, y: this._position.y + e.deltaY};
            return false;
        } else {
            return true;
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
        this._ctx.fillRect(obj.coord.inCanvas.x - 24,obj.coord.inCanvas.y - 24,48,48);
    }

    private _isInBoundingBox(mapObject: MapObject, pos: {x: number, y: number}): boolean {
        // console.log(Math.abs(pos.x - mapObject.coord.inCanvas.x))
        // console.log(Math.abs(pos.y - mapObject.coord.inCanvas.y))
        if (Math.abs(pos.x - mapObject.coord.inCanvas.x) > 24) return false;
        if (Math.abs(pos.y - mapObject.coord.inCanvas.y) > 24) return false;

        return true;
    }
}
