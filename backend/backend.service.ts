import { Injectable } from '@angular/core';
import { Coordinate } from './utils/coordinate.util';


export interface MapObject {
  id: string;
  coord: Coordinate;
}


@Injectable()
export abstract class BackendService {

  public abstract setMapObject(id?: string): void;
  public abstract getMapObject(id: string): MapObject;

}
