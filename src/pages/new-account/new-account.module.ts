import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewAccountPage } from './new-account';

@NgModule({
  declarations: [
    NewAccountPage,
  ],
  imports: [
    IonicPageModule.forChild(NewAccountPage),
  ],
})
export class NewAccountPageModule {}
