import { Injectable } from '@angular/core';
import { Coordinate } from './utils/coordinate.util';


export interface MapObject {
  id: string;
  name: string;
  coord: Coordinate;
  update: boolean;
}


@Injectable()
export abstract class BackendService {
  protected _mapObjects: Array<MapObject> = []

  public abstract setMapObject(id?: string): void;
  public abstract getMapObject(id: string): MapObject;
  public abstract getMapObjects(): Array<MapObject>;

}
