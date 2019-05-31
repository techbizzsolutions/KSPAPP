import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController, Events, IonicApp, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any;
  showedAlert: boolean = false;
  confirmAlert: any;
  user:any;
  pages: Array<{
    title: string,
    component?: any,
    icon: any
  }>;
  constructor(public platform: Platform,
    public menuCtrl: MenuController,
    public alertCtrl: AlertController,
    private ionicApp: IonicApp,
    public events: Events,
    public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();
    events.subscribe('user:loggedIn', () => {
      this.user = JSON.parse(localStorage.getItem('user'));
      if(this.user.role === "Admin")
      {
        console.log("*****",this.user.role);
        this.menuCtrl.swipeEnable(true, 'menu1');

      }
      else{
        this.menuCtrl.swipeEnable(false, 'menu1');

      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString("#8B0000");
      this.splashScreen.hide();
      this.user = JSON.parse(localStorage.getItem('user'));
      // used for an example of ngFor and navigation
      this.pages = [{
          title: 'Report',
          component: 'AdminHomePage',
          icon: 'ios-home'
        },
        {
          title: 'Create Competition',
          component: 'CreateCompititionPage',
          icon: 'ios-create'
        },
        {
          title: 'Competitions List',
          component: 'CompititionListPage',
          icon: 'md-list-box'
        },
        {
          title: 'Add User Information',
          component: 'CreateUserInformationPage',
          icon: 'md-add'
        },
        {
          title: 'Volunteers list',
          component: 'VolunteerslistPage',
          icon: 'md-list-box'
        },
        {
          title: 'Import Candidate List',
          component: 'ImportCandidateListPage',
          icon: 'md-cloud-upload'
        },
        {
          title: 'Add Sport Group',
          component: 'AddSpotGroupPage',
          icon: 'md-add'
        },
        {
          title: 'Sport Group List',
          component: 'SportgrouplistPage',
          icon: 'md-list-box'
        },
        {
          title: 'Log Out',
          icon: 'md-log-out'
        }];
        if (this.user) {
          switch(this.user.role)
          {
            case 'Admin':
            this.menuCtrl.swipeEnable(true, 'menu1');
            this.rootPage = 'AdminHomePage';
            break;
            case 'User':
            this.menuCtrl.swipeEnable(false, 'menu1');
            this.checkUserType(this.user.res);
            break;
            default:
            this.menuCtrl.swipeEnable(false, 'menu1');
            this.rootPage = LoginPage;
          }
      
        } else {
          this.menuCtrl.swipeEnable(false, 'menu1');
          this.rootPage = LoginPage;
        }
        this.platform.registerBackButtonAction(() => {
          let activePortal = this.ionicApp._loadingPortal.getActive() || this.ionicApp._overlayPortal.getActive();
          this.menuCtrl.close();
  
          if (activePortal) {
            activePortal.dismiss();
            activePortal.onDidDismiss(() => {
            });
            //return;
          }
  
          if (this.ionicApp._modalPortal.getActive()) {
            this.ionicApp._modalPortal.getActive().dismiss();
            this.ionicApp._modalPortal.getActive().onDidDismiss(() => {
            });
            return;
          }
          if (this.nav.length() == 1) {
            if (!this.showedAlert) {
              this.confirmExitApp();
            } else {
              this.showedAlert = false;
              this.confirmAlert.dismiss();
            }
          }
          if (this.nav.canGoBack()) {
            this.nav.pop();
          }
  
        });
    });
  }

    // confirmation pop up to exit from app 
    confirmExitApp() {
      this.showedAlert = true;
      this.confirmAlert = this.alertCtrl.create({
        subTitle: "Do you want to exit from the app?",
        buttons: [
          {
            text: 'NO',
            handler: () => {
              this.showedAlert = false;
              return;
            }
          },
          {
            text: 'YES',
            handler: () => {
              this.platform.exitApp();
            }
          }
        ]
      });
      this.confirmAlert.present();
    }

    checkUserType(res)
    {
      switch(res.competition_user_type)
          {
            case '1':
            this.rootPage= 'StartuserPage';
            break;
            case '2':
            this.rootPage= 'CenteruserPage';
            break;
            case '3':
            this.rootPage= 'ResultuserPage';
            break;
            case '4':
            this.rootPage= 'EndStagePage';
            break;
            default:
            this.rootPage= 'StartuserPage';
           }
    }

  openPage(page) {
    console.log("*****",page);
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
      switch(page.title)
      {
        case 'Home':
        this.nav.setRoot(page.component);
        break;
        case 'Log Out':
        localStorage.clear();
        this.menuCtrl.swipeEnable(false, 'menu1');
        this.nav.setRoot(LoginPage);
        break;
        default:
        {
          this.nav.push(page.component);
        }
      }
  }

}
