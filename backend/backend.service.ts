import { Injectable } from '@angular/core';
import { Coordinate } from './utils/coordinate.util';


export interface MapObject {
  id: string;
  name: string;
  coord: Coordinate;
  pinned: boolean;
  update: boolean;
  type: string;

  meta: {
    description?: string;
    size?: number;
    subtype?: string;
    wounded?: number;
    callsign?: string;
  };
}

export interface Squad {
  name: string;
  callsign: string;
}


@Injectable()
export abstract class BackendService {
  public type = 'default';

  protected _mapObjects: Array<MapObject> = [];
  protected _squads: Array<Squad> = [];

  public async abstract deleteMapObject(id: string): Promise<any>;
  public async abstract setMapObject(mapObject: MapObject): Promise<any>;
  public abstract getMapObject(id: string): MapObject;
  public abstract getMapObjects(): Array<MapObject>;

  public getSquads(): Array<Squad> {return []; }
  public onSynchronise(callback) {return; }
}
