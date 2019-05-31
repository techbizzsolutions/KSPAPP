import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import {Validators, FormBuilder } from '@angular/forms';
import { ApiProvider } from '../../providers/api/api';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';

@IonicPage()
@Component({
  selector: 'page-create-compitition',
  templateUrl: 'create-compitition.html',
})
export class CreateCompititionPage {
  Compitition:any;
  comdate:any = "Competition Date";
  comtime:any = "Competition Time"
  sportsType = [];
  param:any = null;
  constructor(public navCtrl: NavController,public formBuilder: FormBuilder,
    private loader: LoaderServiceProvider,
    public api: ApiProvider,
    public toastCtrl: ToastController, public navParams: NavParams) {
      if(Object.keys(this.navParams.data).length)
      {
        console.log("indise");
        this.param = this.navParams.data;
        this.Compitition = this.formBuilder.group({
          CompetitionName: [this.param.name, Validators.required],
          Counters:[this.param.users_involved, Validators.required]
          });
          this.comdate = this.param.start_date;
          this.comtime = this.param.start_time;
      }
      else{
        this.Compitition = this.formBuilder.group({
          CompetitionName: ['', Validators.required],
          Counters:['', Validators.required]
          });
      }
     
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateCompititionPage',this.navParams.data);
    this.getSportsType();
  }

  getCompetition()
  {
    this.loader.Show("Loading...");
    this.api.auth('get_all_sports_type', {
    }).subscribe(res => {
      this.loader.Hide();
      if(res.authorization)
      {
        
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
      let toast = this.toastCtrl.create({
        message: 'Something went wrong, please try again', 
        position: 'top',
        duration: 3000
      });
      toast.present();
    })
  }

  getSportsType()
  {
    this.loader.Show("Loading...");
    this.api.get('get_all_sports_type').subscribe(res => {
      this.loader.Hide();
      if(res.authorization)
      {
         res.all_sports_type.forEach(element => {
          if(this.param)
          {
            this.param.competition_sports_type.forEach(element1 => {
                  if(element1.sports_type_id == element.sports_type_id )
                  {
                    element.selected = true;
                  }
             });
          }
          else{
            element.selected = false;
          }
         });
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

  getDate()
  {
      this.loader.getDate().then(res=>{
        this.comdate = res;
      })
  }

  getTime()
  {
    this.loader.getTime().then(res=>{
      this.comtime = res;
    })
  }

  create()
  {
    if(this.comdate === "Competition Date")
    {
      let toast = this.toastCtrl.create({
        message: 'Please select Competition Date',
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
    }
    if(this.comtime === "Competition Time")
    {
      let toast = this.toastCtrl.create({
        message: 'Please select Competition Time',
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
    }
  
    var arry = [];
    this.sportsType.forEach(element => {
        if(element.selected)
        {
            arry.push({
              "sports_type_id":element.sports_type_id
            });
        }
    });
    if(!arry.length)
    {
      let toast = this.toastCtrl.create({
        message: 'Please select Sports Type',
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
    }
      this.loader.Show("Loading...");
      
    let data;
    let url;
    if(Object.keys(this.navParams.data).length)
    {
      url = "update_competition";
      data = {
        "competition_id":this.param.competition_id,
        "name":this.Compitition.value.CompetitionName,
        "start_date":this.comdate,
        "start_time":this.comtime,
        "users_involved":this.Compitition.value.Counters,
        "sports_types": arry
      }
    }
    else{
      url = "create_competition";
      data = {
        "name":this.Compitition.value.CompetitionName,
        "start_date":this.comdate,
        "start_time":this.comtime,
        "users_involved":this.Compitition.value.Counters,
        "sports_types": arry
      }
    }
    
      this.api.auth(url, data).subscribe(res => {
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
}
