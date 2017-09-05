import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { VotingPage } from '../pages/voting/voting';
import { ContactsPage } from '../pages/contacts/contacts';
import { DelegatePage } from '../pages/delegate/delegate';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;

  backButtonPressedOnceToExit: boolean = false;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private toastCtrl: ToastController) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Voting', component: VotingPage },
      { title: 'Contacts', component: ContactsPage },
      { title: 'Delegate', component: DelegatePage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.platform.registerBackButtonAction(() => {
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
    this.nav.setRoot(page.component);
  }
}
