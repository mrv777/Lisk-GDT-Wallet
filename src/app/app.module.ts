import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SecureStorage } from '@ionic-native/secure-storage';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { NgxPaginationModule } from 'ngx-pagination';
import { Screenshot } from '@ionic-native/screenshot';
import { Clipboard } from '@ionic-native/clipboard';
import { File } from '@ionic-native/file';
import { FileChooser } from '@ionic-native/file-chooser';

import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { VotingPage } from '../pages/voting/voting';
import { DelegatePage } from '../pages/delegate/delegate';
import { SendModalPage } from '../pages/send-modal/send-modal';
import { ReceiveModalPage } from '../pages/receive-modal/receive-modal';
import { NewAccountPage } from '../pages/new-account/new-account';
import { VoteModalPage } from '../pages/vote-modal/vote-modal';
import { ContactsPage } from '../pages/contacts/contacts';
import { EditContactModalPage } from '../pages/edit-contact-modal/edit-contact-modal';
import { TxDetailsModalPage } from '../pages/tx-details-modal/tx-details-modal';
import { AboutPage } from '../pages/about/about';

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
    VotingPage,
    DelegatePage,
    SendModalPage,
    ReceiveModalPage,
    NewAccountPage,
    VoteModalPage,
    ContactsPage,
    EditContactModalPage,
    TxDetailsModalPage,
    AboutPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpModule,
    NgxQRCodeModule,
    NgxPaginationModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    VotingPage,
    DelegatePage,
    SendModalPage,
    ReceiveModalPage,
    NewAccountPage,
    VoteModalPage,
    ContactsPage,
    EditContactModalPage,
    TxDetailsModalPage,
    AboutPage,
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
    Screenshot,
    Clipboard,
    CurrenciesProvider,
    File,
    FileChooser,
  ]
})
export class AppModule {}
