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
    subtype?: number;
    wounded?: number;
    callsign?: string;
    tracked?: boolean;
    timestamp?: number;
    medics?: number;
    technitians?: number;
    scientists?: number;
  };
}

export interface Squad {
  name: string;
}

export interface Operator {
  callsign: string;
  trackerId?: number;
}


@Injectable()
export abstract class BackendService {
  public type = 'default';

  protected _mapObjects: Array<MapObject> = [];
  protected _squads: Array<Squad> = [];
  protected _operators: Array<Operator> = [];

  public async abstract deleteMapObject(id: string): Promise<any>;
  public async abstract setMapObject(mapObject: MapObject): Promise<any>;
  public abstract getMapObject(id: string): MapObject;
  public abstract getMapObjects(): Array<MapObject>;

  public getSquads(): Array<Squad> { return this._squads; }
  public getOperators(): Array<Operator> {return this._operators; }
  public onSynchronise(callback) {return; }
}
