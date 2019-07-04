import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WheelMenuComponent } from './wheel-menu.component';
import { MapObjectContextComponent } from './contexts/map-object-context/map-object-context.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [WheelMenuComponent, MapObjectContextComponent],
    exports: [WheelMenuComponent],
})
export class WheelMenuModule {}
