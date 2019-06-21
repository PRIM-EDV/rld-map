import { NgModule } from '@angular/core';
import { MapComponent } from './map.component';
import { WheelMenuComponent } from './context-menus/wheel-menu/wheel-menu.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PopupMenuComponent } from './context-menus/popup-menu/popup-menu.component';


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
              path: '',
              component: MapComponent
            }
          ])
    ],
    declarations: [MapComponent, WheelMenuComponent, PopupMenuComponent],
    exports: [MapComponent, WheelMenuComponent, PopupMenuComponent],
})
export class MapModule {}
