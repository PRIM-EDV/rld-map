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

  public abstract deleteMapObject(id: string): Promise<any>;
  public abstract updateMapObject(id: string): Promise<any>;
  public abstract createMapObject(obj: MapObject): Promise<any>;
  public abstract getMapObject(id: string): MapObject;
  public abstract getMapObjects(): Array<MapObject>;
}
