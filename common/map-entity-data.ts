import { MapEntityType } from "./map-entity";

export class MapEntityData {
    public id: string = "";
    public position: {x: number, y: number} = {x: 0, y: 0};
    public type: MapEntityType = MapEntityType.TYPE_UNDEFINED;
    public size: number = 1;
    public text: string = "";

}



