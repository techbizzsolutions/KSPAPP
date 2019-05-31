import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';
import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-sportgrouplist',
  templateUrl: 'sportgrouplist.html',
})
export class SportgrouplistPage {
  sportsType = [];
  constructor(public navCtrl: NavController,
    private loader: LoaderServiceProvider,
    public api: ApiProvider,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
     public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SportgrouplistPage');
    this.getSportsType();
  }

  itemclick(item)
  {
    this.navCtrl.push('AddSpotGroupPage',item);
  }

  deleteitem(item)
  {
    console.log('this.item',item);
    let alert = this.alertCtrl.create({
      subTitle: "Do you want to delete this sport group?",
      buttons: [{
        text: 'Ok',
        handler: () => {
          this.loader.Show("Loading...");
          this.api.auth('delete_sports_type', {
            "sports_type_id":item.sports_type_id
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
              for (var i = 0; i < this.sportsType.length; i++) {
                if (this.sportsType[i].sports_type_id != item.sports_type_id) {
                  ramainItem.push(this.sportsType[i]);
                }
            }
               this.sportsType = ramainItem;
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

  getSportsType()
  {
    this.loader.Show("Loading...");
    this.api.get('get_all_sports_type').subscribe(res => {
      this.loader.Hide();
      if(res.authorization)
      {
         this.sportsType = res.all_sports_type;
         console.log('this.sportsType',this.sportsType);
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
