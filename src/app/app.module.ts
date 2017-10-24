import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SecureStorage } from '@ionic-native/secure-storage';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { File } from '@ionic-native/file';
import { FileChooser } from '@ionic-native/file-chooser';
import { PinDialog } from '@ionic-native/pin-dialog';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
 
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';

import { AccountMenuPageModule } from '../pages/account-menu/account-menu.module';
import { VotingPageModule } from '../pages/voting/voting.module'; 
import { DelegatePageModule } from '../pages/delegate/delegate.module';
import { SendModalPageModule } from '../pages/send-modal/send-modal.module';
import { ReceiveModalPageModule } from '../pages/receive-modal/receive-modal.module';
import { SendTabPageModule } from '../pages/send-tab/send-tab.module';
import { ReceiveTabPageModule } from '../pages/receive-tab/receive-tab.module';
import { TransactionsTabPageModule } from '../pages/transactions-tab/transactions-tab.module';
import { NewAccountPageModule } from '../pages/new-account/new-account.module';
import { VoteModalPageModule } from '../pages/vote-modal/vote-modal.module';
import { ContactsPageModule } from '../pages/contacts/contacts.module';
import { ContactsMenuPageModule } from '../pages/contacts-menu/contacts-menu.module';
import { EditContactModalPageModule } from '../pages/edit-contact-modal/edit-contact-modal.module';
import { TxDetailsModalPageModule } from '../pages/tx-details-modal/tx-details-modal.module';
import { AboutPageModule } from '../pages/about/about.module';
import { FingerprintWizardPageModule } from '../pages/fingerprint-wizard/fingerprint-wizard.module';
import { GuestLoginPageModule } from '../pages/guest-login/guest-login.module';
import { RenameAccountPageModule } from '../pages/rename-account/rename-account.module';
import { SendOfflineTxPageModule } from '../pages/send-offline-tx/send-offline-tx.module';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AccountDataProvider } from '../providers/account-data/account-data';
import { AccountProvider } from '../providers/account/account';
import { CurrenciesProvider } from '../providers/currencies/currencies';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    IonicStorageModule.forRoot(),
     TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    AccountMenuPageModule,
    VotingPageModule,
    DelegatePageModule,
    SendModalPageModule,
    ReceiveModalPageModule,
    SendTabPageModule,
    ReceiveTabPageModule,
    TransactionsTabPageModule,
    NewAccountPageModule,
    VoteModalPageModule,
    ContactsPageModule,
    ContactsMenuPageModule,
    EditContactModalPageModule,
    TxDetailsModalPageModule,
    AboutPageModule,
    FingerprintWizardPageModule,
    GuestLoginPageModule,
    RenameAccountPageModule,
    SendOfflineTxPageModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SecureStorage,
    BarcodeScanner,
    FingerprintAIO,
    AccountDataProvider,
    AccountProvider,
    CurrenciesProvider,
    File,
    FileChooser,
    PinDialog,
  ]
})
export class AppModule {}
