export class Coordinate {
    private static _offset: {x: number, y: number} = {x: 0, y: 0};
    private static _scale: number = 1;
    private static _pixelPerMeter: number = 1;

    private _x: number;
    private _y: number;

    constructor(){

    }

    public static set scale(s: number) {
        this._scale = s;
    }

    public static get scale(): number {
        return Coordinate._scale;
    }

    public static get offset(): {x: number, y: number} {
        return {x: Coordinate._offset.x, y: Coordinate._offset.y};
    }

    public static set offset(coord: {x: number, y: number}) {
        this._offset.x = coord.x;
        this._offset.y = coord.y;
    }

    public get inPixel(): {x: number, y: number} {
        return {x: this._x, y: this._y};
    }

    public set inPixel(coord: {x: number, y: number}) {
        this._x = coord.x;
        this._y = coord.y;
    }

    public get inMeter(): {x: number, y: number} {
        return {x: this._x / Coordinate._pixelPerMeter, y: this._y / Coordinate._pixelPerMeter};
    }

    public set inMeter(coord: {x: number, y: number}) {
        this._x = coord.x * Coordinate._pixelPerMeter;
        this._y = coord.y * Coordinate._pixelPerMeter;
    }

    public get inCanvas(): {x: number, y: number} {
        return {x: (this._x + Coordinate._offset.x) * Coordinate._scale, y: (this._y + Coordinate._offset.y) * Coordinate._scale};
    }

    public set inCanvas(coord: {x: number, y: number}) {
        this._x = (coord.x - Coordinate._offset.x) / Coordinate._scale;
        this._y = (coord.y - Coordinate._offset.y) / Coordinate._scale; 
    } 
}
