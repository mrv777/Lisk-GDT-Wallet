import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SecureStorage } from '@ionic-native/secure-storage';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { NgxPaginationModule } from 'ngx-pagination';
import { File } from '@ionic-native/file';
import { FileChooser } from '@ionic-native/file-chooser';
import { PinDialog } from '@ionic-native/pin-dialog';

import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';

import { VotingPageModule } from '../pages/voting/voting.module'; 
import { DelegatePageModule } from '../pages/delegate/delegate.module';
import { SendModalPageModule } from '../pages/send-modal/send-modal.module';
import { ReceiveModalPageModule } from '../pages/receive-modal/receive-modal.module';
import { NewAccountPageModule } from '../pages/new-account/new-account.module';
import { VoteModalPageModule } from '../pages/vote-modal/vote-modal.module';
import { ContactsPageModule } from '../pages/contacts/contacts.module';
import { EditContactModalPageModule } from '../pages/edit-contact-modal/edit-contact-modal.module';
import { TxDetailsModalPageModule } from '../pages/tx-details-modal/tx-details-modal.module';
import { AboutPageModule } from '../pages/about/about.module';
import { FingerprintWizardPageModule } from '../pages/fingerprint-wizard/fingerprint-wizard.module';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AccountDataProvider } from '../providers/account-data/account-data';
import { AccountProvider } from '../providers/account/account';
import { CurrenciesProvider } from '../providers/currencies/currencies';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpModule,
    NgxPaginationModule,
    VotingPageModule,
    DelegatePageModule,
    SendModalPageModule,
    ReceiveModalPageModule,
    NewAccountPageModule,
    VoteModalPageModule,
    ContactsPageModule,
    EditContactModalPageModule,
    TxDetailsModalPageModule,
    AboutPageModule,
    FingerprintWizardPageModule,
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
