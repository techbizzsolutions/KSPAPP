import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import {Validators, FormBuilder } from '@angular/forms';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';
import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-add-spot-group',
  templateUrl: 'add-spot-group.html',
})
export class AddSpotGroupPage {
  Group:any;
  param:any;
  constructor(public navCtrl: NavController,
    private loader: LoaderServiceProvider,
    public api: ApiProvider,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder, public navParams: NavParams) {
      console.log("++",this.param);
      if(Object.keys(this.navParams.data).length)
      {
        this.param = this.navParams.data;
        this.Group = this.formBuilder.group({
          groupname: [this.param.sports_type_name, Validators.required],
          min_age:[this.param.sports_min_age, Validators.required]
          })
      }
      else{
        this.Group = this.formBuilder.group({
          groupname: ['', Validators.required],
          min_age:['', Validators.required]
          })
      }
   ;
  }

  create()
  {
      this.loader.Show("Loading...");
      let data;
      let url;
      if(this.param)
      {
        url = "update_sports_type";
        data = {
          "sports_type_id":this.param.sports_type_id,
          "name":this.Group.value.groupname,
          "min_age":this.Group.value.min_age
        }
      }
      else{
        url = "add_sports_type";
        data = {
          "name":this.Group.value.groupname,
          "min_age":this.Group.value.min_age
        }
      }
      this.api.auth(url,data ).subscribe(res => {
        this.loader.Hide();
        console.log('this.res',res);
        if(res.authorization)
        {
          let toast = this.toastCtrl.create({
            message: res.message, 
            position: 'top',
            duration: 3000
          });
          toast.present();
          this.navCtrl.setRoot('AdminHomePage');
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
    console.log('ionViewDidLoad AddSpotGroupPage');
  }

}
