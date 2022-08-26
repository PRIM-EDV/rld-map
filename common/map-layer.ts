import * as Hammer from 'hammerjs';
import { BehaviorSubject } from 'rxjs';

export abstract class MapLayer {
    public resourceReadyState = new BehaviorSubject<boolean>(false);

    public static origin = {x: 0, y: 0};
    public static panStart = {x: 0, y: 0};
    public static scale = 1.0;

    public abstract  render(): void;

    public onMouseMove(e: MouseEvent): boolean { return true; }
    public onPanStart(e: HammerInput): boolean { return true; }
    public onPan(e: HammerInput, offset: {x: number, y: number}): boolean {return true; }
    public onPanEnd(e: HammerInput) {}
    public onPinchStart(e: HammerInput) {}
    public onPinch(e: HammerInput, pinch: number, center: {x: number, y: number}, offset: {x: number, y: number}) {}
    public onScroll(e: WheelEvent) {}
    public onContextMenu(e: MouseEvent): boolean  {return false; }

}
