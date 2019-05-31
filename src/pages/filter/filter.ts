import { Component } from '@angular/core';
import {  NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';

@Component({
  selector: 'page-filter',
  templateUrl: 'filter.html',
})
export class FilterPage {
  Competition_Name:any;
  Group:any;
  Competitions = [];
  Groups=[];
  constructor(public toastCtrl: ToastController,
    private loader: LoaderServiceProvider,
    public api: ApiProvider,
    private viewCtrl: ViewController,public navCtrl: NavController, public navParams: NavParams) {
  }

  select(item)
  {
    console.log('ionViewDidLoad CreateInformationPage',item);
    this.Competition_Name = item;
    this.getSportsType(item.competition_id);
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

  getSportsType(id)
  {
    this.loader.Show("Loading...");
    this.api.auth('get_sports_type', {
      "competition_id":id
    }).subscribe(res => {
      this.loader.Hide();
      console.log('this.sportsType',res);
      if(res.authorization)
      {
        this.Groups = res.sports_type;
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

  close()
  {
    this.viewCtrl.dismiss();
  }

  view()
  {
    if(!this.Competition_Name)
    {
      let toast = this.toastCtrl.create({
        message: 'Please select Competition Name',
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
    }
    if(!this.Group)
      {
        let toast = this.toastCtrl.create({
          message: 'Please select Sports Type',
          position: 'top',
          duration: 3000
        });
        toast.present();
        return;
      }
    this.viewCtrl.dismiss(
      { 
        competition:(this.Competition_Name)?this.Competition_Name.competition_id:"none",
        group:(this.Group)?this.Group.sports_type_id:"none",
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FilterPage');
    this.getCompetition();
  }

}
