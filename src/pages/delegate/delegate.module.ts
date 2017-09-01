import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DelegatePage } from './delegate';

@NgModule({
  declarations: [
    DelegatePage,
  ],
  imports: [
    IonicPageModule.forChild(DelegatePage),
  ],
})
export class DelegatePageModule {}
