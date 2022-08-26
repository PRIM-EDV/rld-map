import { MapLayer } from "./map-layer";

export enum MapEntityType { 
    TYPE_FOE,
    TYPE_FRIEND,
    TYPE_OBJECT,
} 

export class MapEntity {
    public position =  {x: 0, y: 0};
    public type: MapEntityType = MapEntityType.TYPE_OBJECT;
    public unitSize = 1;
    
    private static unitIcons: HTMLImageElement[] = [];
    private static mapScale = {x: 2.74, y: 2.5};

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;


    constructor(type: MapEntityType, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        this.type = type;
        this.canvas = canvas;
        this.ctx = ctx;
    }

    public render() {
        const px = MapLayer.origin.x + this.position.x * MapEntity.mapScale.x * MapLayer.scale;
        const py = MapLayer.origin.y + this.position.y * MapEntity.mapScale.y * MapLayer.scale;

        if(this.type == MapEntityType.TYPE_FRIEND) {
            if (this.unitSize <  6) this.ctx.drawImage(MapEntity.unitIcons[0], px - 24, py - 24, 48, 48);
            if (this.unitSize >  5 && this.unitSize < 11) this.ctx.drawImage(MapEntity.unitIcons[1], this.position.x - 24, this.position.y - 24, 48, 48);
            if (this.unitSize > 10 && this.unitSize < 16) this.ctx.drawImage(MapEntity.unitIcons[2], this.position.x - 24, this.position.y - 24, 48, 48);
            if (this.unitSize > 15 && this.unitSize < 21) this.ctx.drawImage(MapEntity.unitIcons[3], this.position.x - 24, this.position.y - 24, 48, 48);
        }
    }

    public isUnderCursor(e: any): boolean {
        const px = (e.x  - MapLayer.origin.x) / MapEntity.mapScale.x / MapLayer.scale;
        const py = (e.y  - MapLayer.origin.y) / MapEntity.mapScale.y / MapLayer.scale;

        console.log({x:px, y: py})
        console.log(this.position)

        if (this.position.x - 24 / MapLayer.scale < px && this.position.x + 24 / MapLayer.scale > px){
            if(this.position.y - 24 / MapLayer.scale < py && this.position.y + 24 / MapLayer.scale > py) {
                return true
            }
        }
        return false;
    }

    public static loadIcons() {
        const unitAssetUrls = [
            "assets/icons/icon_friend.svg",
            "assets/icons/icon_friend10.svg",
            "assets/icons/icon_friend15.svg",
            "assets/icons/icon_friend20.svg",
        ]

        for (const url of unitAssetUrls) {
            this.unitIcons.push(new Image());
            this.unitIcons[this.unitIcons.length - 1].src = url;
        }
    }

}

