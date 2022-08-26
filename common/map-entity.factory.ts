import { MapEntity, MapEntityType } from "./map-entity";

export class MapEntityFactory {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.ctx = ctx;

        MapEntity.loadIcons();
    }

    create(type: MapEntityType): MapEntity {
        return new MapEntity(type, this.canvas, this.ctx);
    }
}