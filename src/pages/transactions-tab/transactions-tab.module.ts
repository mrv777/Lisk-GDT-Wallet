import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransactionsTabPage } from './transactions-tab';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    TransactionsTabPage,
  ],
  imports: [
    IonicPageModule.forChild(TransactionsTabPage),
    TranslateModule.forChild(),
    NgxPaginationModule,
  ],
})
export class TransactionsTabPageModule {}
