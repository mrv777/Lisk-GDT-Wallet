import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TxDetailsModalPage } from './tx-details-modal';

@NgModule({
  declarations: [
    TxDetailsModalPage,
  ],
  imports: [
    IonicPageModule.forChild(TxDetailsModalPage),
  ],
})
export class TxDetailsModalPageModule {}
