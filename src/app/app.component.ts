import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ToastController, IonicApp, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';

import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { VotingPage } from '../pages/voting/voting';
import { ContactsPage } from '../pages/contacts/contacts';
import { DelegatePage } from '../pages/delegate/delegate';
import { AboutPage } from '../pages/about/about';

import { AccountDataProvider } from '../providers/account-data/account-data';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{title: string, component: any, icon: string}>;

  backButtonPressedOnceToExit: boolean = false;

  constructor(public platform: Platform, public statusBar: StatusBar, private menuCtrl: MenuController, private ionicApp: IonicApp, public splashScreen: SplashScreen, private toastCtrl: ToastController, public accountData: AccountDataProvider, translate: TranslateService) {
    this.initializeApp();

    translate.setDefaultLang('en');

    // The language to use. ToDo: Should be changed to the user's locale.
    //translate.use('it');

    // used for an example of ngFor and navigation
    // this.pages = [
    //   { title: 'Account', component: HomePage, icon: 'home' },
    //   { title: 'Voting', component: VotingPage, icon: 'thumbs-up' },
    //   { title: 'Contacts', component: ContactsPage, icon: 'contacts' },
    //   { title: 'My Delegate', component: DelegatePage, icon: 'person' },
    //   { title: 'About', component: AboutPage, icon: 'information-circle' },
    // ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.platform.registerBackButtonAction(() => {
        // if (this.keyboard.isOpen()) { // Handles the keyboard if open
        //     this.keyboard.close();
        //     return;
        // }

        let activePortal = this.ionicApp._loadingPortal.getActive() ||
           this.ionicApp._modalPortal.getActive() ||
           this.ionicApp._overlayPortal.getActive();
    
        //activePortal is the active overlay like a modal,toast,etc
        if (activePortal) {
            activePortal.dismiss();
            return;
        }
        else if (this.menuCtrl.isOpen()) { // Close menu if open
            this.menuCtrl.close();
            return;
        }

        if (this.backButtonPressedOnceToExit) {
          this.platform.exitApp();
        } else if (this.nav.canGoBack()) {
          this.nav.pop({});
        } else {
          this.showToast();
          this.backButtonPressedOnceToExit = true;
          setTimeout(() => {
            this.backButtonPressedOnceToExit = false;
          },2000)
        }
      });
    });
  }

  showToast() {
    let toast = this.toastCtrl.create({
      message: 'Press Again to Exit',
      duration: 2000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  openPage(page) {
    if (page == 'Account'){
      this.nav.push(HomePage);
    } else if (page == 'Voting'){
      this.nav.push(VotingPage);
    } else if (page == 'Contacts'){
      this.nav.push(ContactsPage);
    } else if (page == 'Delegate'){
      this.nav.push(DelegatePage);
    } else if (page == 'About'){
      this.nav.push(AboutPage);
    }
  }

  logout() {
    this.accountData.logout();
    this.nav.setRoot(LoginPage);
  }
}
