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

    private _position = {x: 0, y: 0};

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, backend: BackendService, contextMenuService: ContextMenuService) {
        super();

        this._canvas = canvas;
        this._contextMenuService = contextMenuService;
        this._ctx = ctx;
        this._backend = backend;

        this._iconset.resourceReadyState.subscribe((isReady: boolean) => {
            if (isReady) {
                this.resourceReadyState.next(true);
            }
        });
    }

    public draw() {
        const mapObjects = this._backend.getMapObjects();

        mapObjects.forEach((mapObject) => {
            this._drawIcon(mapObject);
        });

        mapObjects.forEach((mapObject) => {
            if(mapObject.meta.tracked) {
                this._ctx.drawImage(this._iconset.tracked, mapObject.coord.inCanvas.x + 26, mapObject.coord.inCanvas.y - 38, 12, 12)
            }
        });

        mapObjects.forEach((mapObject) => {
            if (mapObject.type == 'friend') {
                this._drawLine(mapObject.meta.callsign, {x: mapObject.coord.inCanvas.x + 26, y: mapObject.coord.inCanvas.y - 24});
            } else {
                this._drawLine(mapObject.name, {x: mapObject.coord.inCanvas.x + 26, y: mapObject.coord.inCanvas.y - 24});
            }
        });

        mapObjects.forEach((mapObject) => {
            if (mapObject == this._hoveredMapObject) {
                this._drawIcon(mapObject);

                if(mapObject.pinned && !mapObject.meta.tracked) {
                    this._ctx.drawImage(this._iconset.pinned, mapObject.coord.inCanvas.x + 26, mapObject.coord.inCanvas.y - 38, 12, 12)
                }

                if (mapObject.type == 'friend') {
                    this._drawLine(mapObject.meta.callsign, {x: mapObject.coord.inCanvas.x + 26, y: mapObject.coord.inCanvas.y - 24});
                    this._drawLine(mapObject.name, {x: mapObject.coord.inCanvas.x + 26, y: mapObject.coord.inCanvas.y});
                    
                    if (mapObject.meta.description) {
                        this._drawMultiLine(mapObject.meta.description, {x: mapObject.coord.inCanvas.x + 26, y: mapObject.coord.inCanvas.y + 24}, 200);
                    }
                } else {
                    this._drawLine(mapObject.name, {x: mapObject.coord.inCanvas.x + 26, y: mapObject.coord.inCanvas.y - 24});
                    
                    if (mapObject.meta.description) {
                        this._drawMultiLine(mapObject.meta.description, {x: mapObject.coord.inCanvas.x + 26, y: mapObject.coord.inCanvas.y}, 200);
                    }
                }
            }
        });

        
    }

    public onClick(pos: {x: number, y: number}) {

    }

    public onContextMenu(e: MouseEvent): boolean {
        const mapObjects = this._backend.getMapObjects();
        const offset = this._canvas.getBoundingClientRect();

        for (const object of mapObjects) {
            if (this._isInBoundingBox(object, {x: e.x - offset.left, y: e.y - offset.top})) {
                const position = {x: object.coord.inCanvas.x + offset.left, y: object.coord.inCanvas.y + offset.top};
                this._contextMenuService.wheelMenu.editObjectContext.open(position, object);
                return false;
            }
        }

        return true;
    }

    public onMouseMove(e: MouseEvent): boolean {
        const mapObjects = this._backend.getMapObjects();
        const offset = this._canvas.getBoundingClientRect();
        const nearMapObjects = [];

        mapObjects.forEach(object => {
            if (this._isInBoundingBox(object, {x: e.x - offset.left, y: e.y - offset.top})) {
                nearMapObjects.push(object);
            }
        });

        if (nearMapObjects.length > 0) {
            const object = this._getMapObjectNearestToCursor(nearMapObjects, {x: e.x - offset.left, y: e.y - offset.top});

            if (this._hoveredMapObject != object) {
                this._hoveredMapObject = object;
                return false;
            }
        } else {
            if (this._hoveredMapObject != null) {
                this._hoveredMapObject = null;
                return false;
            }
        }

        return true;
    }

    public onPanStart(e: HammerInput) {
        const mapObjects = this._backend.getMapObjects();
        const nearMapObjects = [];

        this._position = { x: e.center.x - e.target.getBoundingClientRect().left, y: e.center.y - e.target.getBoundingClientRect().top};
        mapObjects.forEach(object => {
            if (this._isInBoundingBox(object, this._position)) {
                nearMapObjects.push(object);
            }
        });

        if (nearMapObjects.length > 0) {
            this._draggedMapObject = this._getMapObjectNearestToCursor(nearMapObjects, this._position);
            this._draggedMapObject.update = false;
        } else {
            return true;
        }
    }

    public onPanEnd(e: HammerInput) {
        if (this._draggedMapObject != null) {
            this._backend.setMapObject(this._draggedMapObject).then();
            this._draggedMapObject.update = true;
            this._draggedMapObject = null;
        }
    }

    public onPan(e: HammerInput, offset: {x: number, y: number}): boolean {
        if (this._draggedMapObject != null) {
            if(!this._draggedMapObject.pinned && !this._draggedMapObject.meta.tracked) {
                this._draggedMapObject.coord.inCanvas = {x: this._position.x + e.deltaX, y: this._position.y + e.deltaY};
            }
            return false;
        } else {
            return true;
        }
    }

    private _drawIcon(mapObject: MapObject) {
        switch (mapObject.type) {
            case 'self': {
                this._ctx.drawImage(this._iconset.self, mapObject.coord.inCanvas.x - 24, mapObject.coord.inCanvas.y - 24, 48, 48);
                break;
            }
            case 'friend': {
                let idx = 0;
                let smallSize = 10;

                this._ctx.drawImage(this._iconset.friend, mapObject.coord.inCanvas.x - 24, mapObject.coord.inCanvas.y - 24, 48, 48);
                
                for(let i = 0; i < mapObject.meta.medics; i++) {
                    this._ctx.drawImage(this._iconset.medic, mapObject.coord.inCanvas.x + 14 - smallSize * idx, mapObject.coord.inCanvas.y + 24, smallSize, smallSize);
                    idx++;
                }

                for(let i = 0; i < mapObject.meta.technitians; i++) {
                    this._ctx.drawImage(this._iconset.tech, mapObject.coord.inCanvas.x + 14 - smallSize * idx, mapObject.coord.inCanvas.y + 24, smallSize, smallSize);
                    idx++;
                }

                for(let i = 0; i < mapObject.meta.scientists; i++) {
                    this._ctx.drawImage(this._iconset.science, mapObject.coord.inCanvas.x + 14 - smallSize * idx, mapObject.coord.inCanvas.y + 24, smallSize, smallSize);
                    idx++;
                }

                if (mapObject.meta.size - mapObject.meta.wounded > 0) {
                    this._ctx.drawImage(this._iconset.unitSizeFriend[mapObject.meta.size - 1 - mapObject.meta.wounded], mapObject.coord.inCanvas.x - 24, mapObject.coord.inCanvas.y - 24, 48, 48);
                }

                if (mapObject.meta.wounded > 0) {
                    this._ctx.drawImage(this._iconset.woundedFriend[mapObject.meta.wounded - 1], mapObject.coord.inCanvas.x - 24, mapObject.coord.inCanvas.y - 24, 48, 48);
                }
                break;
            }
            case 'foe': {
                this._ctx.drawImage(this._iconset.foe, mapObject.coord.inCanvas.x - 24, mapObject.coord.inCanvas.y - 24, 48, 48);
                break;
            }
            case 'object': {
                this._ctx.drawImage(this._iconset.object, mapObject.coord.inCanvas.x - 24, mapObject.coord.inCanvas.y - 24, 48, 48);

                if(mapObject.meta.subtype) {
                    this._ctx.drawImage(this._iconset.objectSubtype[mapObject.meta.subtype], mapObject.coord.inCanvas.x - 24, mapObject.coord.inCanvas.y - 24, 48, 48);
                }
            }
        }
    }

    private _drawLine(name: string, pos: {x: number, y: number}) {
        const textWidth = this._ctx.measureText(name).width;

        if (textWidth > 0) {
            this._ctx.fillStyle = '#151515';
            this._ctx.fillRect(pos.x, pos.y, textWidth + 12, 22);
            this._ctx.fillStyle = '#a0a0a0';
            this._ctx.font = '14px roboto';
            this._ctx.fillText(name , pos.x + 6, pos.y + 16);
        }
    }

    private _drawMultiLine(text: string, pos: {x: number, y: number}, width: number) {
        if (text.length > 0) {
            const words = text.split(' ');
            const lines = [];
            let line = '';
    
            words.forEach((word, index) => {
                if (this._ctx.measureText(line + ' ' + word).width > (width - 12)) {
                    lines.push(line);
                    line = word;
                } else {
                    line += ' ' + word;
                }
    
                if (index == words.length - 1) {
                    lines.push(line);
                }
            });
    
            lines.forEach((line, index) => {
                this._ctx.fillStyle = '#151515';
                this._ctx.fillRect(pos.x, pos.y + index * 24, width, 24);
                this._ctx.fillStyle = '#a0a0a0';
                this._ctx.font = '14px roboto';
                this._ctx.fillText(line , pos.x + 6, pos.y + index * 24 + 17);
            });
        }   
    }

    private _isInBoundingBox(mapObject: MapObject, pos: {x: number, y: number}): boolean {
        if (Math.abs(pos.x - mapObject.coord.inCanvas.x) > 24) { return false; }
        if (Math.abs(pos.y - mapObject.coord.inCanvas.y) > 24) { return false; }

        return true;
    }

    private _getMapObjectNearestToCursor(mapObjects: Array<MapObject>, cursorPos: {x: number, y: number}) {
        let dist = Infinity;
        let ret = null;

        mapObjects.forEach((mapObject) => {
            const objectDist = Math.pow(mapObject.coord.inCanvas.x - cursorPos.x, 2) + Math.pow(mapObject.coord.inCanvas.y - cursorPos.y, 2);

            if (objectDist < dist) {
                dist = objectDist;
                ret = mapObject;
            }
        });

        return ret;
    }
}
