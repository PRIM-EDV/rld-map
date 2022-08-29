// import { Layer } from '../core';
// import { BackendService } from 'src/app/backend/backend.service';
// import { PrimIconset } from '../utils/prim.iconset';
// import { MapObject } from 'src/app/core/map-object';

import { MapLayer } from "../common/map-layer";
import { MapEntity } from "../common/map-entity";
import { MapEntityFactory } from "../common/map-entity.factory";
import { MapEntityData } from "../common/map-entity-data";

export class EntitiesLayer extends MapLayer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private mapScale = {x: 2.74, y: 2.5}

    public entities: MapEntity[] = [];
    private entityFactory: MapEntityFactory;
    // private _iconset: PrimIconset = new PrimIconset();
    // private _backend: BackendService;
    private draggedEntity?: MapEntity;
    // private _hoveredMapObject: MapObject = null;

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        super();

        this.canvas = canvas;
        this.ctx = ctx;
        this.entityFactory = new MapEntityFactory(this.canvas, this.ctx);

        // this.entities.push(this.entityFactory.create(MapEntityType.TYPE_FRIEND))
        // this.entities.push(this.entityFactory.create(MapEntityType.TYPE_FRIEND))



        this.resourceReadyState.next(true);
        // this._iconset.resourceReadyState.subscribe((isReady: boolean) => {
        //     if (isReady) {
        //         this.resourceReadyState.next(true);
        //     }
        // });
    }

    public createMapEntity(data: MapEntityData) {
        const entity = this.entityFactory.create(data.type);

        entity.id = data.id;
        entity.position = data.position
        // entity.
        this.entities.push(entity);
    }

    public override onPanStart(e: HammerInput): boolean {
        const cursorPosition = { x: e.center.x - e.target.getBoundingClientRect().left, y: e.center.y - e.target.getBoundingClientRect().top};
        
        for(const entity of this.entities) {
            if(entity.isUnderCursor(cursorPosition)) {
                this.draggedEntity = entity;
                return false;
            }
        }

        return true;
    }

    public override onPan(e: any, offset: {x: number, y: number}): boolean {
        const cursorPosition = { x: e.center.x - e.target.getBoundingClientRect().left, y: e.center.y - e.target.getBoundingClientRect().top};

        const px = (cursorPosition.x  - MapLayer.origin.x) / this.mapScale.x / MapLayer.scale;
        const py = (cursorPosition.y  - MapLayer.origin.y) / this.mapScale.y / MapLayer.scale;

        if(this.draggedEntity){
            this.draggedEntity.position.x = px;
            this.draggedEntity.position.y = py;
            return false;
        }

        return true;
    }

    public override onPanEnd(e: HammerInput): void {
        this.draggedEntity = undefined;
    }

    public override onScroll(e: WheelEvent) {

    }

    public override onContextMenu(e: MouseEvent) {
        const cursorPosition = { x: e.x - this.canvas.offsetLeft, y: e.y - this.canvas.offsetTop };

        for(const entity of this.entities) {
            if(entity.isUnderCursor(cursorPosition)) {
                return true;
            }
        }

        return false;
    }

    // public draw() {
    //     const mapObjects = this._backend.getMapObjects();

    //     mapObjects.forEach((mapObject) => {
    //         this._drawIcon(mapObject);
    //     });

    //     mapObjects.forEach((mapObject) => {
    //         if(mapObject.meta.tracked) {
    //             this._ctx.drawImage(this._iconset.tracked, mapObject.coord.inCanvas.x + 26, mapObject.coord.inCanvas.y - 38, 12, 12)
    //         }
    //     });

    //     mapObjects.forEach((mapObject) => {
    //         if (mapObject.type == 'friend') {
    //             this._drawLine(mapObject.meta.callsign, {x: mapObject.coord.inCanvas.x + 26, y: mapObject.coord.inCanvas.y - 24});
    //         } else {
    //             this._drawLine(mapObject.name, {x: mapObject.coord.inCanvas.x + 26, y: mapObject.coord.inCanvas.y - 24});
    //         }
    //     });

    //     mapObjects.forEach((mapObject) => {
    //         if (mapObject == this._hoveredMapObject) {
    //             this._drawIcon(mapObject);

    //             if(mapObject.pinned && !mapObject.meta.tracked) {
    //                 this._ctx.drawImage(this._iconset.pinned, mapObject.coord.inCanvas.x + 26, mapObject.coord.inCanvas.y - 38, 12, 12)
    //             }

    //             if (mapObject.type == 'friend') {
    //                 this._drawLine(mapObject.meta.callsign, {x: mapObject.coord.inCanvas.x + 26, y: mapObject.coord.inCanvas.y - 24});
    //                 this._drawLine(mapObject.name, {x: mapObject.coord.inCanvas.x + 26, y: mapObject.coord.inCanvas.y});
                    
    //                 if (mapObject.meta.description) {
    //                     this._drawMultiLine(mapObject.meta.description, {x: mapObject.coord.inCanvas.x + 26, y: mapObject.coord.inCanvas.y + 24}, 200);
    //                 }
    //             } else {
    //                 this._drawLine(mapObject.name, {x: mapObject.coord.inCanvas.x + 26, y: mapObject.coord.inCanvas.y - 24});
                    
    //                 if (mapObject.meta.description) {
    //                     this._drawMultiLine(mapObject.meta.description, {x: mapObject.coord.inCanvas.x + 26, y: mapObject.coord.inCanvas.y}, 200);
    //                 }
    //             }
    //         }
    //     });

        
    // }

    public override render(): void {
        this.entities.forEach(entity => {
            entity.render();
        })
    }

    public onClick(pos: {x: number, y: number}) {

    }

    // public onMouseMove(e: MouseEvent): boolean {
    //     const mapObjects = this._backend.getMapObjects();
    //     const offset = this._canvas.getBoundingClientRect();
    //     const nearMapObjects = [];

    //     mapObjects.forEach(object => {
    //         if (this._isInBoundingBox(object, {x: e.x - offset.left, y: e.y - offset.top})) {
    //             nearMapObjects.push(object);
    //         }
    //     });

    //     if (nearMapObjects.length > 0) {
    //         const object = this._getMapObjectNearestToCursor(nearMapObjects, {x: e.x - offset.left, y: e.y - offset.top});

    //         if (this._hoveredMapObject != object) {
    //             this._hoveredMapObject = object;
    //             return false;
    //         }
    //     } else {
    //         if (this._hoveredMapObject != null) {
    //             this._hoveredMapObject = null;
    //             return false;
    //         }
    //     }

    //     return true;
    // }

    // public onPanEnd(e: HammerInput) {
    //     if (this._draggedMapObject != null) {
    //         this._backend.setMapObject(this._draggedMapObject).then();
    //         this._draggedMapObject.update = true;
    //         this._draggedMapObject = null;
    //     }
    // }

    // public onPan(e: HammerInput, offset: {x: number, y: number}): boolean {
    //     if (this._draggedMapObject != null) {
    //         if(!this._draggedMapObject.pinned && !this._draggedMapObject.meta.tracked) {
    //             this._draggedMapObject.coord.inCanvas = {x: this._position.x + e.deltaX, y: this._position.y + e.deltaY};
    //         }
    //         return false;
    //     } else {
    //         return true;
    //     }
    // }

    // private _drawIcon(mapObject: MapObject) {
    //     switch (mapObject.type) {
    //         case 'self': {
    //             this._ctx.drawImage(this._iconset.self, mapObject.coord.inCanvas.x - 24, mapObject.coord.inCanvas.y - 24, 48, 48);
    //             break;
    //         }
    //         case 'friend': {
    //             let idx = 0;
    //             let smallSize = 10;

    //             this._ctx.drawImage(this._iconset.friend, mapObject.coord.inCanvas.x - 24, mapObject.coord.inCanvas.y - 24, 48, 48);
                
    //             for(let i = 0; i < mapObject.meta.medics; i++) {
    //                 this._ctx.drawImage(this._iconset.medic, mapObject.coord.inCanvas.x + 14 - smallSize * idx, mapObject.coord.inCanvas.y + 24, smallSize, smallSize);
    //                 idx++;
    //             }

    //             for(let i = 0; i < mapObject.meta.technitians; i++) {
    //                 this._ctx.drawImage(this._iconset.tech, mapObject.coord.inCanvas.x + 14 - smallSize * idx, mapObject.coord.inCanvas.y + 24, smallSize, smallSize);
    //                 idx++;
    //             }

    //             for(let i = 0; i < mapObject.meta.scientists; i++) {
    //                 this._ctx.drawImage(this._iconset.science, mapObject.coord.inCanvas.x + 14 - smallSize * idx, mapObject.coord.inCanvas.y + 24, smallSize, smallSize);
    //                 idx++;
    //             }

    //             if (mapObject.meta.size - mapObject.meta.wounded > 0) {
    //                 this._ctx.drawImage(this._iconset.unitSizeFriend[mapObject.meta.size - 1 - mapObject.meta.wounded], mapObject.coord.inCanvas.x - 24, mapObject.coord.inCanvas.y - 24, 48, 48);
    //             }

    //             if (mapObject.meta.wounded > 0) {
    //                 this._ctx.drawImage(this._iconset.woundedFriend[mapObject.meta.wounded - 1], mapObject.coord.inCanvas.x - 24, mapObject.coord.inCanvas.y - 24, 48, 48);
    //             }
    //             break;
    //         }
    //         case 'foe': {
    //             this._ctx.drawImage(this._iconset.foe, mapObject.coord.inCanvas.x - 24, mapObject.coord.inCanvas.y - 24, 48, 48);
    //             if (mapObject.meta.size) {
    //                 this._ctx.drawImage(this._iconset.unitSizeFoe[mapObject.meta.size], mapObject.coord.inCanvas.x - 24, mapObject.coord.inCanvas.y - 24, 48, 48);
    //             }
    //             break;
    //         }
    //         case 'object': {
    //             this._ctx.drawImage(this._iconset.object, mapObject.coord.inCanvas.x - 24, mapObject.coord.inCanvas.y - 24, 48, 48);

    //             if(mapObject.meta.subtype) {
    //                 this._ctx.drawImage(this._iconset.objectSubtype[mapObject.meta.subtype], mapObject.coord.inCanvas.x - 24, mapObject.coord.inCanvas.y - 24, 48, 48);
    //             }
    //         }
    //     }
    // }

    // private _drawLine(name: string, pos: {x: number, y: number}) {
    //     const textWidth = this._ctx.measureText(name).width;

    //     if (textWidth > 0) {
    //         this._ctx.fillStyle = '#151515';
    //         this._ctx.fillRect(pos.x, pos.y, textWidth + 12, 22);
    //         this._ctx.fillStyle = '#a0a0a0';
    //         this._ctx.font = '14px roboto';
    //         this._ctx.fillText(name , pos.x + 6, pos.y + 16);
    //     }
    // }

    // private _drawMultiLine(text: string, pos: {x: number, y: number}, width: number) {
    //     if (text.length > 0) {
    //         const words = text.split(' ');
    //         const lines = [];
    //         let line = '';
    
    //         words.forEach((word, index) => {
    //             if (this._ctx.measureText(line + ' ' + word).width > (width - 12)) {
    //                 lines.push(line);
    //                 line = word;
    //             } else {
    //                 line += ' ' + word;
    //             }
    
    //             if (index == words.length - 1) {
    //                 lines.push(line);
    //             }
    //         });
    
    //         lines.forEach((line, index) => {
    //             this._ctx.fillStyle = '#151515';
    //             this._ctx.fillRect(pos.x, pos.y + index * 24, width, 24);
    //             this._ctx.fillStyle = '#a0a0a0';
    //             this._ctx.font = '14px roboto';
    //             this._ctx.fillText(line , pos.x + 6, pos.y + index * 24 + 17);
    //         });
    //     }   
    // }



    // private _getMapObjectNearestToCursor(mapObjects: Array<MapObject>, cursorPos: {x: number, y: number}) {
    //     let dist = Infinity;
    //     let ret = null;

    //     mapObjects.forEach((mapObject) => {
    //         const objectDist = Math.pow(mapObject.coord.inCanvas.x - cursorPos.x, 2) + Math.pow(mapObject.coord.inCanvas.y - cursorPos.y, 2);

    //         if (objectDist < dist) {
    //             dist = objectDist;
    //             ret = mapObject;
    //         }
    //     });

    //     return ret;
    // }
}
