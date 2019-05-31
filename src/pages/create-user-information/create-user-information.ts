import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';
import {Validators, FormBuilder } from '@angular/forms';
import { ApiProvider } from '../../providers/api/api';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';

@IonicPage()
@Component({
  selector: 'page-create-user-information',
  templateUrl: 'create-user-information.html',
})
export class CreateUserInformationPage {
  Competition_Name:any;
  Competitions = [];
  positions = [];
  position:any;  
  user:any;
  information:any;
  param:any;
  Users=[
    {
      name:'Start User', id:'1'
    },
    {
      name:'Center User', id:'2'
    },
    {
      name:'Result User', id:'3'
    },
    {
      name:'End User', id:'4'
    }
  ];
  constructor(public navCtrl: NavController,
    private loader: LoaderServiceProvider,
    public api: ApiProvider,public toastCtrl: ToastController,public formBuilder: FormBuilder, public navParams: NavParams) {
      if(Object.keys(this.navParams.data).length)
      {
        this.param = this.navParams.data;
        this.information = this.formBuilder.group({
          Mobile : [this.param.phone,Validators.compose([Validators.required, Validators.pattern('^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$'), Validators.maxLength(15)])],
          Password:['', Validators.required],
          Name:[this.param.name, Validators.required],
          });
          this.Users.forEach(element => {
              if(element.id == this.param.competition_user_type)
              {
                 this.user = element;
              }
          });
          this.Competition_Name = {
            competition_id:this.param.competition_id
          }

      }
      else{
        this.information = this.formBuilder.group({
          Mobile : ['',Validators.compose([Validators.required, Validators.pattern('^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$'), Validators.maxLength(15)])],
          Password:['', Validators.required],
          Name:['', Validators.required],
          });
      }
      
  }

  select(competition)
  {
    this.positions = [];
    if(Object.keys(this.navParams.data).length)
      {
        this.position = {
          id: parseInt(this.param.position) 
        }
      }
    for (let index = 0; index < competition.users_involved; index++) {
      this.positions.push({id:index + 1});
    }
    console.log(this.positions);
  }

  compareFnpos(e1, e2): boolean {
    console.log(e1 , "-" , e2);
    return e1 && e2 ? e1.id === e2.id : e1 === e2;
  }

  compareFncom(e1, e2): boolean {
    return e1 && e2 ? e1.competition_id === e2.competition_id : e1 === e2;
  }

  compareFn(e1, e2): boolean {
    return e1 && e2 ? e1.id === e2.id : e1 === e2;
  }

  create()
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
    if(!this.position)
    {
      let toast = this.toastCtrl.create({
        message: 'Please select user position',
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
    }
    if(!this.user)
    {
      let toast = this.toastCtrl.create({
        message: 'Please select user type',
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
    }

    let data;
      let url;
      if(this.param)
      {
        url = "update_user";
        data = {
          "competition_volunteer_id": this.param.user_id,
          "competition_id":this.Competition_Name.competition_id,
          "competition_user_type":this.user.id,
          "position":this.position.id,
          "phone":this.information.value.Mobile,
          "password":this.information.value.Password,
          "name":this.information.value.Name
        }
      }
      else{
        url = "add_user";
        data = {
          "competition_id":this.Competition_Name.competition_id,
          "competition_user_type":this.user.id,
          "position":this.position.id,
          "phone":this.information.value.Mobile,
          "password":this.information.value.Password,
          "name":this.information.value.Name
        }
      }

    this.loader.Show("Loading...");
    this.api.auth(url, data).subscribe(res => {
      this.loader.Hide();
      console.log('this.add_user',res);
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
    console.log('ionViewDidLoad CreateInformationPage',this.navParams.data);
    this. getCompetition();
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
         if(Object.keys(this.navParams.data).length)
         {
          this.Competitions.forEach(element => {
                 if(element.competition_id == this.param.competition_id)
                 {
                    this.select(element);
                 }
            });
         }
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
