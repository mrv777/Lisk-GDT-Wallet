import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReceiveModalPage } from './receive-modal';
import { NgxQRCodeModule } from 'ngx-qrcode2';

@NgModule({
  declarations: [
    ReceiveModalPage,
  ],
  imports: [
    IonicPageModule.forChild(ReceiveModalPage),
    NgxQRCodeModule,
  ],
})
export class ReceiveModalPageModule {}
