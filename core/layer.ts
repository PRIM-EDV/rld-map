import * as Hammer from 'hammerjs';
import { BehaviorSubject } from 'rxjs';

export abstract class Layer {
    public resourceReadyState = new BehaviorSubject<boolean>(false);

    public abstract draw();

    public onContextMenu(e: MouseEvent): boolean {return true; }
    public onMouseMove(e: MouseEvent): boolean {return true; }
    public onPanStart(e: HammerInput) {}
    public onPan(e: HammerInput, offset: {x: number, y: number}): boolean {return true; }
    public onPanEnd(e: HammerInput) {}
    public onPinchStart(e: HammerInput) {}
    public onPinch(e: HammerInput, pinch: number, center: {x: number, y: number}, offset: {x: number, y: number}) {}
    public onScroll(e: MouseWheelEvent) {}
}
