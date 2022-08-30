import { MapEntity } from "./map-entity";
import { MapEntityData } from "./map-entity-data";

export class MapEntityFactory {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.ctx = ctx;

        MapEntity.loadIcons();
    }

    create(data: MapEntityData): MapEntity {
        const entity = new MapEntity(data.type, this.canvas, this.ctx);

        entity.id = data.id;
        entity.size = data.size;
        entity.text = data.text;
        
        return entity;
    }
}