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

        entity.updateBackgroundImageData();
        entity.animatePing();
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
        const cursorPosition = { x: e.x - this.canvas.getBoundingClientRect().left, y: e.y - this.canvas.getBoundingClientRect().top };

        for(const entity of this.entities) {
            if(entity.isUnderCursor(cursorPosition)) {
                this.contextEntityData = entity.getData();
                return true;
            }
        }

        return false;
    }

    public override render(): void {
        this.entities.forEach(entity => {
            entity.updateBackgroundImageData();
        })

        this.entities.forEach(entity => {
            entity.render();
        })
    }

    public onClick(pos: {x: number, y: number}) {

    }
}
