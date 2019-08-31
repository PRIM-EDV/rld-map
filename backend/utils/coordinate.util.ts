

export class Coordinate {
    public static _origin = {x: 640, y: 500};

    protected static _viewportOffset = {x: 0, y: 0};
    protected static _offset = {x: 0, y: 0};
    protected static _scale = 1.0;
    protected static _pixelPerMeter = 2.6;

    protected _x: number;
    protected _y: number;

    constructor() {
        this._x = 0;
        this._y = 0;
    }

    public static set scale(s: number) {
        this._scale = s;
    }

    public static get scale(): number {
        return Coordinate._scale;
    }

    public static get offset(): {x: number, y: number} {
        return this._offset;
    }

    public static get viewportOffset(): {x: number, y: number} {
        return this._viewportOffset;
    }

    public static set offset(coord: {x: number, y: number}) {
        this._offset = coord;
    }

    public static set viewportOffset(coord: {x: number, y: number}) {
        this._viewportOffset = coord;
    }

    public get inPixel(): {x: number, y: number} {
        return {x: this._x, y: this._y};
    }

    public set inPixel(coord: {x: number, y: number}) {
        this._x = coord.x;
        this._y = coord.y;
    }

    public get inMeter(): {x: number, y: number} {
        return {x: (this._x - Coordinate._origin.x) / Coordinate._pixelPerMeter, y: (this._y - Coordinate._origin.y) / Coordinate._pixelPerMeter};
    }

    public set inMeter(coord: {x: number, y: number}) {
        this._x = (coord.x * Coordinate._pixelPerMeter) + Coordinate._origin.x;
        this._y = (coord.y * Coordinate._pixelPerMeter) + Coordinate._origin.y;
    }

    public get inCanvas(): {x: number, y: number} {
        return {x: (this._x - Coordinate._offset.x) / Coordinate._scale, y: (this._y - Coordinate._offset.y) / Coordinate._scale};
    }

    public set inCanvas(coord: {x: number, y: number}) {
        this._x = Coordinate._offset.x + (coord.x * Coordinate._scale);
        this._y = Coordinate._offset.y + (coord.y * Coordinate._scale);
    }

    public get inWindow(): {x: number, y: number} {
        return {
            x: ((this._x - Coordinate._offset.x) / Coordinate._scale) + Coordinate._viewportOffset.x,
            y: ((this._y - Coordinate._offset.y) / Coordinate._scale) + Coordinate._viewportOffset.y
        };
    }

    public set inWindow(coord: {x: number, y: number}) {
        this._x = Coordinate._offset.x + ((coord.x - Coordinate._viewportOffset.x) * Coordinate._scale);
        this._y = Coordinate._offset.y + ((coord.y - Coordinate._viewportOffset.y) * Coordinate._scale);
    }
}
