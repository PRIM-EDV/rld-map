import { NgModule } from '@angular/core';
import { MapComponent } from './map.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PopupMenuModule } from './context-menu/popup-menu/popup-menu.module';
import { WheelMenuModule } from './context-menu/wheel-menu/wheel-menu.module';


@NgModule({
    imports: [
        CommonModule,
        PopupMenuModule,
        WheelMenuModule,
        RouterModule.forChild([
            {
              path: '',
              component: MapComponent
            }
          ])
    ],
    declarations: [MapComponent],
    exports: [MapComponent],
})
export class MapModule {}
