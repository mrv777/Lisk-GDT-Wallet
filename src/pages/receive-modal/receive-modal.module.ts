import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReceiveModalPage } from './receive-modal';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { Clipboard } from '@ionic-native/clipboard';

@NgModule({
  declarations: [
    ReceiveModalPage,
  ],
  imports: [
    IonicPageModule.forChild(ReceiveModalPage),
    NgxQRCodeModule,
  ],
  providers: [
  	Clipboard,
  ],
})
export class ReceiveModalPageModule {}
