import { Injectable } from '@angular/core';
import { Coordinate } from './utils/coordinate.util';


export interface MapObject {
  id: string;
  name: string;
  coord: Coordinate;
  update: boolean;
  type: string;
}


@Injectable()
export abstract class BackendService {
  protected _mapObjects: Array<MapObject> = []

  public async abstract deleteMapObject(id: string): Promise<any>;
  public async abstract setMapObject(mapObject: MapObject): Promise<any>;
  public abstract getMapObject(id: string): MapObject;
  public abstract getMapObjects(): Array<MapObject>;

  public onSynchronise(callback) {return};
}
