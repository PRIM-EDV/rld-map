import { v4 } from "uuid";
import { MapEntityData } from "./map-entity-data";
import { MapLayer } from "./map-layer";

export enum MapEntityType { 
    TYPE_UNDEFINED = 0,
    TYPE_FOE = 1,
    TYPE_FRIEND = 2,
    TYPE_OBJECT = 3,
} 

export class MapEntity {
    public id = v4();
    public position =  {x: 0, y: 0};
    public type: MapEntityType = MapEntityType.TYPE_OBJECT;
    public size = 1;
    public text = "";
    
    private static unitIcons: HTMLImageElement[] = [];
    private static enemyIcons: HTMLImageElement[] = [];
    private static objectIcons: HTMLImageElement[] = [];

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
            this.ctx.drawImage(MapEntity.unitIcons[this.size - 1], px - 24, py - 24, 48, 48);

            this.ctx.font = '11px Fira Code';
            this.ctx.fillStyle = '#000000';
            this.ctx.lineWidth = 2;
            this.ctx.strokeText(this.text, px, py+32);

            this.ctx.font = '11px Fira Code';
            this.ctx.fillStyle = '#ffffff';
            this.ctx.lineWidth = 1;
            this.ctx.fillText(this.text, px, py+32);
        }

        if(this.type == MapEntityType.TYPE_FOE) {
            this.ctx.drawImage(MapEntity.enemyIcons[this.size - 1], px - 24, py - 24, 48, 48);
        }

        if(this.type == MapEntityType.TYPE_OBJECT) {
            this.ctx.drawImage(MapEntity.objectIcons[0], px - 24, py - 24, 48, 48);

            this.ctx.font = '11px Fira Code';
            this.ctx.fillStyle = '#000000';
            this.ctx.lineWidth = 2;
            this.ctx.strokeText(this.text, px, py+32);

            this.ctx.font = '11px Fira Code';
            this.ctx.fillStyle = '#ffffff';
            this.ctx.lineWidth = 1;
            this.ctx.fillText(this.text, px, py+32);
        }
    }

    public isUnderCursor(e: any): boolean {
        const size = 12;
        const px = (e.x  - MapLayer.origin.x) / MapEntity.mapScale.x / MapLayer.scale;
        const py = (e.y  - MapLayer.origin.y) / MapEntity.mapScale.y / MapLayer.scale;

        if (this.position.x - size / MapLayer.scale / MapEntity.mapScale.x < px && this.position.x + size / MapLayer.scale / MapEntity.mapScale.x > px){
            if(this.position.y - size / MapLayer.scale / MapEntity.mapScale.y < py && this.position.y + size / MapLayer.scale / MapEntity.mapScale.y > py) {
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
            "assets/icons/icon_friend25.svg",
            "assets/icons/icon_friend30.svg",
        ]

        const enemyAssetUrls = [
            "assets/icons/icon_foe.svg",
            "assets/icons/icon_foe10.svg",
            "assets/icons/icon_foe15.svg",
            "assets/icons/icon_foe20.svg",
            "assets/icons/icon_foe25.svg",
            "assets/icons/icon_foe30.svg",
        ]

        const objectAssetUrls = [
            "assets/icons/icon_object.svg",
        ]

        for (const url of enemyAssetUrls) {
            this.enemyIcons.push(new Image());
            this.enemyIcons[this.enemyIcons.length - 1].src = url;
        }

        for (const url of unitAssetUrls) {
            this.unitIcons.push(new Image());
            this.unitIcons[this.unitIcons.length - 1].src = url;
        }

        for (const url of objectAssetUrls) {
            this.objectIcons.push(new Image());
            this.objectIcons[this.objectIcons.length - 1].src = url;
        }
    }

    public getData(): MapEntityData {
        const data = new MapEntityData();

        data.id = this.id;
        data.position = this.position;
        data.type = this.type;

        data.text = this.text;

        return data;
    }


}

