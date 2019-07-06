import { NgModule } from '@angular/core';
import { MapComponent } from './map.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PopupMenuModule } from './context-menu/popup-menu/popup-menu.module';
import { WheelMenuComponent } from './context-menu/wheel-menu/wheel-menu.component';


@NgModule({
    imports: [
        CommonModule,
        PopupMenuModule,
        RouterModule.forChild([
            {
              path: '',
              component: MapComponent
            }
          ])
    ],
    declarations: [MapComponent, WheelMenuComponent],
    exports: [MapComponent, WheelMenuComponent],
})
export class MapModule {}
