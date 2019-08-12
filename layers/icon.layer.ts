import { Layer } from '../core/layer';
import { MapObject, BackendService } from '../backend/backend.service';
import { Coordinate } from '../backend/utils/coordinate.util';
import { ContextMenuService } from '../shared/context-menu.service';
import { PrimIconset } from '../utils/prim.iconset';

export class IconLayer extends Layer {
    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;
    private _iconset: PrimIconset = new PrimIconset();
    private _contextMenuService: ContextMenuService;
    private _backend: BackendService;
    private _draggedMapObject: MapObject = null;
    private _hoveredMapObject: MapObject = null;

    private _position = {x: 0, y:0};

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, backend: BackendService, contextMenuService: ContextMenuService) {
        super();
        
        this._canvas = canvas;
        this._contextMenuService = contextMenuService;
        this._ctx = ctx;
        this._backend = backend;

        this._iconset.resourceReadyState.subscribe((isReady: boolean) => {
            if(isReady) {
                this.resourceReadyState.next(true);
            };
        })
    }

    public draw() {
        const mapObjects = this._backend.getMapObjects();
        // Draw Icons
        for(let mapObject of mapObjects) {
            if(mapObject == this._hoveredMapObject) {
                this._ctx.drawImage(this._iconset.select,mapObject.coord.inCanvas.x - 24, mapObject.coord.inCanvas.y - 24, 48, 48);

                if(mapObject.pinned) {
                    this._ctx.drawImage(this._iconset.pinned, mapObject.coord.inCanvas.x + 26, mapObject.coord.inCanvas.y - 38, 12, 12)
                }
            }
            switch(mapObject.type) {
                case "object": {
                    this._drawObject(mapObject);   
                    break;
                }
                case "friend": {
                    this._drawFriend(mapObject);
                    break;
                }
                case "foe": {
                    this._drawFoe(mapObject);
                    break;
                }
            }    
        }
    }

    public onClick(pos: {x: number, y: number}) {
        
    }

    public onContextMenu(e: MouseEvent): boolean {
        const mapObjects = this._backend.getMapObjects();
        const offset = this._canvas.getBoundingClientRect();

        for (let object of mapObjects) {
            if (this._isInBoundingBox(object, {x: e.x - offset.left, y: e.y - offset.top})) {
                const position = {x: object.coord.inCanvas.x + offset.left, y: object.coord.inCanvas.y + offset.top}
                this._contextMenuService.wheelMenu.editObjectContext.open(position, object);
                return false;
            } 
        }

        return true;
    }

    public onMouseMove(e: MouseEvent): boolean {
        const mapObjects = this._backend.getMapObjects();
        const offset = this._canvas.getBoundingClientRect();
        let nearMapObjects = [];

        mapObjects.forEach(object => {
            if (this._isInBoundingBox(object, {x: e.x - offset.left, y: e.y - offset.top})) {
                nearMapObjects.push(object);
            } 
        });

        if(nearMapObjects.length > 0){
            let object = this._getMapObjectNearestToCursor(nearMapObjects, {x: e.x - offset.left, y: e.y - offset.top});
            
            if(this._hoveredMapObject != object) {
                this._hoveredMapObject = object;
                return false;
            } 
        } else {
            if(this._hoveredMapObject != null) {
                this._hoveredMapObject = null;
                return false;
            } 
        }

        return true;
    }

    public onPanStart(e: HammerInput) {
        const mapObjects = this._backend.getMapObjects();
        let nearMapObjects = [];
        
        this._position = { x: e.center.x - e.target.getBoundingClientRect().left, y: e.center.y - e.target.getBoundingClientRect().top}
        mapObjects.forEach(object => {
            if (this._isInBoundingBox(object, this._position)) {
                nearMapObjects.push(object);
            } 
        });

        if(nearMapObjects.length > 0){
            this._draggedMapObject = this._getMapObjectNearestToCursor(nearMapObjects, this._position);
            this._draggedMapObject.update = false;
        } else {
            return true;
        }   
    }

    public onPanEnd(e: HammerInput) {
        if(this._draggedMapObject != null) {
            this._backend.setMapObject(this._draggedMapObject).then();
            this._draggedMapObject.update = true;
            this._draggedMapObject = null;
        }
    }

    public onPan(e: HammerInput, offset: {x: number, y: number}): boolean {
        if (this._draggedMapObject != null) {
            if(!this._draggedMapObject.pinned) {
                this._draggedMapObject.coord.inCanvas = {x: this._position.x + e.deltaX, y: this._position.y + e.deltaY};
            }
            return false;
        } else {
            return true;
        }
    }

    private _drawFoe(obj: MapObject) {
        this._ctx.drawImage(this._iconset.foe,obj.coord.inCanvas.x - 24, obj.coord.inCanvas.y - 24, 48, 48)
    }

    private _drawFriend(obj: MapObject) {
        this._ctx.drawImage(this._iconset.friend,obj.coord.inCanvas.x - 24, obj.coord.inCanvas.y - 24, 48, 48)

        if (obj.meta.size - obj.meta.wounded > 0) {
            this._ctx.drawImage(this._iconset.unitSizeFriend[obj.meta.size - 1 - obj.meta.wounded], obj.coord.inCanvas.x - 24, obj.coord.inCanvas.y - 24, 48, 48)
        }

        if (obj.meta.wounded > 0) {
            this._ctx.drawImage(this._iconset.woundedFriend[obj.meta.wounded - 1], obj.coord.inCanvas.x - 24, obj.coord.inCanvas.y - 24, 48, 48)
        }
        
        // if(Number.isNaN(obj.meta.size) || obj.meta.size == 0 || obj.meta.size == undefined) {
        //     // this._ctx.drawImage(this._iconset.unitSizeFriend[14],obj.coord.inCanvas.x - 24, obj.coord.inCanvas.y - 24, 48, 48)
        // } else {
            // this._ctx.drawImage(this._iconset.unitSizeFriend[obj.meta.size - 1 - obj.meta.wounded], obj.coord.inCanvas.x - 24, obj.coord.inCanvas.y - 24, 48, 48)
        // }

        // if(Number.isNaN(obj.meta.wounded) || obj.meta.wounded == 0 || obj.meta.wounded == undefined) {
        //     // this._ctx.drawImage(this._iconset.woundedFriend[14], obj.coord.inCanvas.x - 24, obj.coord.inCanvas.y - 24, 48, 48)
        // } else {
            // this._ctx.drawImage(this._iconset.woundedFriend[obj.meta.wounded - 1], obj.coord.inCanvas.x - 24, obj.coord.inCanvas.y - 24, 48, 48)
        // }

        if(obj == this._hoveredMapObject && obj != this._draggedMapObject) {
            this._drawLine(obj.name, {x: obj.coord.inCanvas.x + 26, y: obj.coord.inCanvas.y})

            if(obj.meta.description) {
                this._drawMultiLine(obj.meta.description, {x: obj.coord.inCanvas.x + 26, y: obj.coord.inCanvas.y + 24}, 200);
            }
        }

        this._drawLine(obj.meta.callsign, {x: obj.coord.inCanvas.x + 26, y: obj.coord.inCanvas.y - 24})
    }

    private _drawObject(obj: MapObject) {
        this._ctx.drawImage(this._iconset.object,obj.coord.inCanvas.x - 24, obj.coord.inCanvas.y - 24, 48, 48);
        this._drawLine(obj.name, {x: obj.coord.inCanvas.x + 26, y: obj.coord.inCanvas.y - 24})
        // this._ctx.fillRect(obj.coord.inCanvas.x - 24,obj.coord.inCanvas.y - 24,48,48);
    }

    private _drawLine(name: string, pos: {x: number, y: number}) {
        const textWidth = this._ctx.measureText(name).width;

        if(textWidth > 0) {
            this._ctx.fillStyle = "#151515";
            this._ctx.fillRect(pos.x, pos.y, textWidth + 12, 22);
            this._ctx.fillStyle = "#a0a0a0";
            this._ctx.font = "14px roboto";
            this._ctx.fillText(name , pos.x + 6, pos.y + 16);
        }
    }

    private _drawMultiLine(text: string, pos: {x: number, y: number}, width: number) {
        const words = text.split(' ');
        let lines = [];
        let line = '';

        words.forEach((word, index) => {
            if(this._ctx.measureText(line + ' ' + word).width > (width - 12)) {
                lines.push(line);
                line = word;
            } else {
                line += ' ' + word;
            }

            if(index == words.length - 1) {
                lines.push(line);
            }
        });

        lines.forEach((line, index) => {
            this._ctx.fillStyle = "#151515";
            this._ctx.fillRect(pos.x, pos.y + index * 24, width, 24);
            this._ctx.fillStyle = "#a0a0a0";
            this._ctx.font = "14px roboto";
            this._ctx.fillText(line , pos.x + 6, pos.y + index * 24 + 17);
        });       
    }

    private _isInBoundingBox(mapObject: MapObject, pos: {x: number, y: number}): boolean {
        if (Math.abs(pos.x - mapObject.coord.inCanvas.x) > 24) return false;
        if (Math.abs(pos.y - mapObject.coord.inCanvas.y) > 24) return false;

        return true;
    }

    private _getMapObjectNearestToCursor(mapObjects: Array<MapObject>, cursorPos: {x: number, y: number}) {
        let dist = Infinity;
        let ret = null;

        mapObjects.forEach((mapObject) => {
            let objectDist = Math.pow(mapObject.coord.inCanvas.x - cursorPos.x, 2) + Math.pow(mapObject.coord.inCanvas.y - cursorPos.y, 2);

            if(objectDist < dist) {
                dist = objectDist;
                ret = mapObject;
            }
        })

        return ret;
    }
}
