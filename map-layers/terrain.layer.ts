import { MapLayer } from '../common/map-layer';

export class TerrainLayer extends MapLayer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private mapSvg: HTMLImageElement = new Image();
    private mapSvg2: HTMLImageElement = new Image();

    private mapSize = {w: 3237.02, h: 2935.81}
    private mapScale = {x: 2.74, y: 2.5}
    private panStarted = false;

    private _ox = -90;
    private _oy = -320;

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        super();

        this.canvas = canvas;
        this.ctx = ctx;

        // this.mapSvg.src = "assets/img/prim.map.svg";
        this.mapSvg2.src = "assets/img/prim.map2.dark.svg";

        this.mapSvg.onload = () => {
            this.resourceReadyState.next(true);
        }
    }

    public render() {
        // this.ctx.drawImage(this.mapSvg, MapLayer.origin.x, MapLayer.origin.y, this.mapSize.w * MapLayer.scale, this.mapSize.h * MapLayer.scale);
        this.ctx.drawImage(this.mapSvg2, MapLayer.origin.x - this._ox * MapLayer.scale, MapLayer.origin.y - this._oy * MapLayer.scale, 3540 * MapLayer.scale,  2440 * MapLayer.scale);
        this.drawGrid();
    }

    public override getLocalPosition(e: MouseEvent): { x: number; y: number; } {
        const cursorPosition = { x: e.x - this.canvas.getBoundingClientRect().left, y: e.y - this.canvas.getBoundingClientRect().top };


        const px = (cursorPosition.x  - MapLayer.origin.x) / this.mapScale.x / MapLayer.scale;
        const py = (cursorPosition.y  - MapLayer.origin.y) / this.mapScale.y / MapLayer.scale;

        return {x: px, y: py}
    }

    public override onContextMenu(e: MouseEvent) {
        return true;
    }

    public override onPanStart(e: HammerInput): boolean {
        MapLayer.panStart = MapLayer.origin;
        this.panStarted = true;

        return true;
    }

    public override onPan(e: any, offset: {x: number, y: number}): boolean {
        if (e.maxPointers === 1 && this.panStarted) {
            MapLayer.origin = {
                x: MapLayer.panStart.x + e.deltaX,
                y: MapLayer.panStart.y + e.deltaY
            }
        }

        return true;
    }

    public override onPanEnd(e: HammerInput): void {
        this.panStarted = false;
    }

    public override onPinch(e: HammerInput, scale: number) {
        scale = scale / (1 / e.scale);

        const offset = {
            x: ((e.center.x - this.canvas.getBoundingClientRect().left - MapLayer.origin.x) / MapLayer.scale) * (MapLayer.scale - scale), 
            y: ((e.center.y - this.canvas.getBoundingClientRect().top - MapLayer.origin.y) / MapLayer.scale) * (MapLayer.scale - scale)
        }

        MapLayer.origin = {
            x: MapLayer.origin.x + offset.x,
            y: MapLayer.origin.y + offset.y
        }

        MapLayer.scale = scale;
    }

    public override onScroll(e: WheelEvent) {
        const scale = MapLayer.scale / (1 + e.deltaY / 1000);
        const offset = {
            x: ((e.x - this.canvas.getBoundingClientRect().left - MapLayer.origin.x) / MapLayer.scale) * (MapLayer.scale - scale), 
            y: ((e.y - this.canvas.getBoundingClientRect().top - MapLayer.origin.y) / MapLayer.scale) * (MapLayer.scale - scale)
        }

        MapLayer.origin = {
            x: MapLayer.origin.x + offset.x,
            y: MapLayer.origin.y + offset.y
        }
        MapLayer.scale = scale;
    }

    private drawGrid() {
        const offset = {x: 182, y: 248};
        this.ctx.globalAlpha = 0.3;
        for (let i = 0; i < 35; i++) {
            let w30 = 30 * this.mapScale.x * MapLayer.scale;
            let px = MapLayer.origin.x + i * w30 + offset.x * this.mapScale.x * MapLayer.scale;

            
            this.ctx.strokeStyle= '#000000';
            this.ctx.lineWidth = 1;

            this.ctx.beginPath();
            this.ctx.moveTo(px, 0);
            this.ctx.lineTo(px, this.canvas.height);
            this.ctx.stroke();
            this.ctx.closePath();
        }

        for (let i = 0; i < 27; i++) {
            let w30 = 30 * this.mapScale.y * MapLayer.scale;
            let py = MapLayer.origin.y + i * w30 + offset.y * this.mapScale.y * MapLayer.scale;

            
            this.ctx.strokeStyle= '#000000';
            this.ctx.lineWidth = 1;

            this.ctx.beginPath();
            this.ctx.moveTo(0, py);
            this.ctx.lineTo(this.canvas.width, py);
            this.ctx.stroke();
            this.ctx.closePath();
        }

        this.ctx.globalAlpha = 1.0;

        this.ctx.fillStyle = '#1b1b1b';
        this.ctx.fillRect(0, this.canvas.height - 20, this.canvas.width, 20);
        this.ctx.fillRect(0, 0, 20, this.canvas.height);

        this.ctx.font = '12px Fira Code';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.textAlign = "center";


        for (let i = 0; i < 35; i++) {
            let w30 = 30 * this.mapScale.x * MapLayer.scale;
            let px = MapLayer.origin.x + i * w30 + offset.x * this.mapScale.x * MapLayer.scale;;

            this.ctx.fillText("X" + String(i + 1) , px + w30 / 2, this.canvas.height - 4);
        }
        this.ctx.save();
        this.ctx.rotate(-Math.PI/2);

        for (let i = 0; i < 27; i++) {
            let w30 = 30 * this.mapScale.y * MapLayer.scale;
            let py = MapLayer.origin.y + i * w30 + offset.y * this.mapScale.y * MapLayer.scale;

            this.ctx.fillText("Y" + String( 27 - i) , -py - w30 / 2, 14);
        }
        this.ctx.restore();
    }
}
