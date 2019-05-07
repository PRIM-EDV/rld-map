import { Coordinate } from './coordinate.util';

export class Direction extends Coordinate {
    constructor() {
        super();
    }

    public get inCanvas(): {x: number, y: number} {
        return {x: (this._x) * Coordinate._scale, y: (this._y) * Coordinate._scale};
    }

    public set inCanvas(coord: {x: number, y: number}) {
        this._x = (coord.x) / Coordinate._scale;
        this._y = (coord.y) / Coordinate._scale;
    }
}
