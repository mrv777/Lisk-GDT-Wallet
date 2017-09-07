import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewAccountPage } from './new-account';
import { NgxQRCodeModule } from 'ngx-qrcode2';

@NgModule({
  declarations: [
    NewAccountPage,
  ],
  imports: [
    IonicPageModule.forChild(NewAccountPage),
    NgxQRCodeModule,
  ],
})
export class NewAccountPageModule {}
