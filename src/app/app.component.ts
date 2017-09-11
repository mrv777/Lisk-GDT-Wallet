import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ToastController, IonicApp, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { VotingPage } from '../pages/voting/voting';
import { ContactsPage } from '../pages/contacts/contacts';
import { DelegatePage } from '../pages/delegate/delegate';
import { AboutPage } from '../pages/about/about';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{title: string, component: any}>;

  backButtonPressedOnceToExit: boolean = false;

  constructor(public platform: Platform, public statusBar: StatusBar, private menuCtrl: MenuController, private ionicApp: IonicApp, public splashScreen: SplashScreen, private toastCtrl: ToastController) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Voting', component: VotingPage },
      { title: 'Contacts', component: ContactsPage },
      { title: 'Delegate', component: DelegatePage },
      { title: 'About', component: AboutPage },
    ];

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
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.push(page.component);
  }
}
