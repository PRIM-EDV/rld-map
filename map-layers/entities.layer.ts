import { MapLayer } from "../common/map-layer";
import { MapEntity } from "../common/map-entity";
import { MapEntityFactory } from "../common/map-entity.factory";
import { Subject } from "rxjs";
import { MapEntityData } from "../common/map-entity-data";

export class EntitiesLayer extends MapLayer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private mapScale = {x: 2.74, y: 2.5}

    public entities: MapEntity[] = [];
    private entityFactory: MapEntityFactory;
    private draggedEntity?: MapEntity;
    // private _hoveredMapObject: MapObject = null;

    public contextEntityData?: MapEntityData;
    public onEntityMoved: Subject<MapEntityData> = new Subject<MapEntityData>();

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        super();

        this.canvas = canvas;
        this.ctx = ctx;
        this.entityFactory = new MapEntityFactory(this.canvas, this.ctx);

        this.resourceReadyState.next(true);
    }

    public createMapEntity(data: MapEntityData) {
        const entity = this.entityFactory.create(data);

        entity.id = data.id;
        entity.position = data.position
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
        if(this.draggedEntity) {
            this.onEntityMoved.next(this.draggedEntity!.getData());
            this.draggedEntity = undefined;
        }
    }

    public override onScroll(e: WheelEvent) {

    }

    public override onContextMenu(e: MouseEvent) {
        const cursorPosition = { x: e.x - this.canvas.offsetLeft, y: e.y - this.canvas.offsetTop };

        for(const entity of this.entities) {
            if(entity.isUnderCursor(cursorPosition)) {
                this.contextEntityData = entity.getData();
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

    // 
}
