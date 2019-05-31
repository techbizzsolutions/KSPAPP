import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';
import { ApiProvider } from '../../providers/api/api';

/**
 * Generated class for the VolunteerslistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-volunteerslist',
  templateUrl: 'volunteerslist.html',
})
export class VolunteerslistPage {
  Competitions = [];
  volunteers = [];
  competition_id:any;
  constructor(public navCtrl: NavController,
    private loader: LoaderServiceProvider,
    public api: ApiProvider,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
     public navParams: NavParams) {
  }

  itemclick(item)
  {
    item.competition_id = this.competition_id;
    this.navCtrl.push('CreateUserInformationPage',item);
  }

  deleteitem(item)
  {
    console.log('this.item',item);
    let alert = this.alertCtrl.create({
      subTitle: "Do you want to delete this user?",
      buttons: [{
        text: 'Ok',
        handler: () => {
          this.loader.Show("Loading...");
          this.api.auth('delete_user', {
            "competition_id":this.competition_id,
            "competition_volunteer_id": item.user_id
          }).subscribe(res => {
            this.loader.Hide();
            console.log('this.inactive_competition',res);
            if(res.authorization)
            {
              let toast = this.toastCtrl.create({
                message: res.message, 
                position: 'top',
                duration: 3000
              });
              toast.present();
              let ramainItem = [];
              for (var i = 0; i < this.volunteers.length; i++) {
                if (this.volunteers[i].user_id != item.user_id) {
                  ramainItem.push(this.volunteers[i]);
                }
            }
               this.volunteers = ramainItem;
            }
            else{
              let toast = this.toastCtrl.create({
                message: res.message, 
                position: 'top',
                duration: 3000
              });
              toast.present();
            }
            
          }, err => {
            this.loader.Hide();
            console.log('login err',err);
            let toast = this.toastCtrl.create({
              message: 'Something went wrong, please try again', 
              position: 'top',
              duration: 3000
            });
            toast.present();
          })
        }
      },
      {
        text: 'Cancel',
        handler: () => {
          // close the sliding item
        }
      }]
    });
    // now present the alert on top of all other content
    alert.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VolunteerslistPage');
    this.getCompetition();
  }

  select(competition)
  {
    console.log(competition);
    this.competition_id = competition.competition_id;
    this.loader.Show("Loading...");
    this.api.auth('get_volunteers_list',{
      "competition_id":competition.competition_id
    }).subscribe(res => {
      this.loader.Hide();
      console.log('this.get_competition_list',res);
      if(res.authorization)
      {
         this.volunteers = res.volunteers_list;
         
      }
      else{
        let toast = this.toastCtrl.create({
          message: res.message, 
          position: 'top',
          duration: 3000
        });
        toast.present();
      }
      
    }, err => {
      this.loader.Hide();
      console.log('login err',err);
      let toast = this.toastCtrl.create({
        message: 'Something went wrong, please try again', 
        position: 'top',
        duration: 3000
      });
      toast.present();
    })
  }

  getCompetition()
  {
    this.loader.Show("Loading...");
    this.api.get('get_competition_list').subscribe(res => {
      this.loader.Hide();
      console.log('this.get_competition_list',res);
      if(res.authorization)
      {
         this.Competitions = res.lisitng;
         console.log('this.get_competition_list',this.Competitions);
      }
      else{
        let toast = this.toastCtrl.create({
          message: res.message, 
          position: 'top',
          duration: 3000
        });
        toast.present();
      }
      
    }, err => {
      this.loader.Hide();
      console.log('login err',err);
      let toast = this.toastCtrl.create({
        message: 'Something went wrong, please try again', 
        position: 'top',
        duration: 3000
      });
      toast.present();
    })
  }

}
