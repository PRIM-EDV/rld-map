import { MapLayer } from "./map-layer";

export enum MapEntityType { 
    TYPE_UNDEFINED = 0,
    TYPE_FOE = 1,
    TYPE_FRIEND = 2,
    TYPE_OBJECT = 3,
} 

export class MapEntityData {
    public id: string = "";
    public position: {x: number, y: number} = {x: 0, y: 0};
    public type: MapEntityType = MapEntityType.TYPE_UNDEFINED;

    public squad: { name: string, callsign: string, trackerId: number | string, combattants: number } = { name: '', callsign: '', trackerId: -1, combattants: 1}

}