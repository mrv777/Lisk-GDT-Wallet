import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewAccountPage } from './new-account';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { Screenshot } from '@ionic-native/screenshot';

@NgModule({
  declarations: [
    NewAccountPage,
  ],
  imports: [
    IonicPageModule.forChild(NewAccountPage),
    NgxQRCodeModule,
  ],
  providers: [
  	Screenshot,
  ]
})
export class NewAccountPageModule {}
