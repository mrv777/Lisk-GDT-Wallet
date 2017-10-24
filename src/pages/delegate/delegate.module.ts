import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DelegatePage } from './delegate';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    DelegatePage,
  ],
  imports: [
    IonicPageModule.forChild(DelegatePage),
    TranslateModule.forChild(),
  ],
})
export class DelegatePageModule {}
