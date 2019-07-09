import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WheelMenuComponent } from './wheel-menu.component';
import { MapObjectContextComponent } from './contexts/map-object-context/map-object-context.component';
import { EditObjectContextComponent } from './contexts/edit-object-context/edit-object-context.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [WheelMenuComponent, MapObjectContextComponent, EditObjectContextComponent],
    exports: [WheelMenuComponent],
})
export class WheelMenuModule {}

