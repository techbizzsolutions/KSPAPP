import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-resultuser',
  templateUrl: 'resultuser.html',
})
export class ResultuserPage {
  total:any;
  constructor(public navCtrl: NavController,
    private loader: LoaderServiceProvider,
    public api: ApiProvider,
    public toastCtrl : ToastController,
     public navParams: NavParams) {
  }

  logout() {
    localStorage.clear();
    this
      .navCtrl
      .setRoot(LoginPage);
  }
  create()
  {
    this.loader.Show("Loading...");
    this.api.auth('bib_result_entry', {
    }).subscribe(res => {
      this.loader.Hide();
      console.log('this.bib_result_entry',res);
      if(res.authorization)
      {
        this.total = res.total_clicks_done;
        let toast = this.toastCtrl.create({
          message: res.message, 
          position: 'top',
          duration: 3000
        });
        toast.present();
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
  ionViewDidLoad() {
    console.log('ionViewDidLoad ResultuserPage');
  }

}
