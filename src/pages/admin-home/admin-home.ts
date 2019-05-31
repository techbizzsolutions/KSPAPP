import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Platform, ModalController } from 'ionic-angular';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';
import { ApiProvider } from '../../providers/api/api';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { FilterPage } from '../filter/filter';


@IonicPage()
@Component({
  selector: 'page-admin-home',
  templateUrl: 'admin-home.html',
})
export class AdminHomePage {
  Competition_Name:any;
  Group:any;
  Competitions = [];
  Groups=[];
  constructor(public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    private loader: LoaderServiceProvider,
    private androidPermissions: AndroidPermissions,
    private fileOpener: FileOpener,
    private transfer: FileTransfer,
    private file: File,
    public platform: Platform,
    public api: ApiProvider,
    public navCtrl: NavController, public navParams: NavParams) {
  }

  select(item)
  {
    console.log('ionViewDidLoad CreateInformationPage',item);
    this.Competition_Name = item;
    this.getSportsType(item.competition_id);
  }

  reload()
  {
    this.ionViewDidLoad();
    this.Groups = [];
    this.Competition_Name = null;
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
         if(!this.Competitions.length)
         {
          let toast = this.toastCtrl.create({
            message: 'Please create competition first', 
            position: 'top',
            duration: 3000
          });
          toast.present();
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

  retrieveFile(code) {
    if (this.platform.is('cordova')) {
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
        result => {
          console.log('Has permission?', result.hasPermission);
          if (result.hasPermission) {
            this.download(code);
          }
          else {
            this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE);
          }
        },
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
      );
    }
  }

  download(imageLocation) {
    this.loader.Show("Downloading...");
    console.log('item', decodeURI(imageLocation));
    console.log('item', encodeURI(imageLocation));
    this.platform.ready().then(() => {
      const fileTransfer: FileTransferObject = this.transfer.create();
        fileTransfer.download(encodeURI(imageLocation), (this.file.externalRootDirectory || this.file.dataDirectory) + 'KSPAPP/'+imageLocation.substr(imageLocation.lastIndexOf('/') + 1)).then((entry) => {
        console.log('download complete: ' + entry.toURL());
        let toast = this.toastCtrl.create({
          message: 'Image downloaded successfully, file location is inside filemanager/KSPAPP',
          position: 'top',
          duration: 3000
        });
        toast.present();
        this.fileOpener.open(decodeURI(entry.toURL()),'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
          .then(() => console.log('File is opened'))
          .catch(e => console.log('Error openening file', e));
        this.loader.Hide();
      }, (error) => {
        // handle error
        console.log('download error: ', error);
        let toast = this.toastCtrl.create({
          message: 'Something went wrong, please try again',
          position: 'top',
          duration: 3000
        });
        toast.present();
        this.loader.Hide();
      });

    });
  }


  presentDatePopover() {
    let myModal = this.modalCtrl.create(FilterPage);
    myModal.onDidDismiss((data) => {
      if(data)
      {
         console.log(data);
         //this.getReport(data);
      }
    });
    myModal.present();
  }

  getReport()
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
    this.loader.Show("Loading...");
    this.api.auth('get_report', {
      "competition_id":this.Competition_Name.competition_id,
      "sports_type_id":this.Group.sports_type_id
    }).subscribe(res => {
      this.loader.Hide();
      console.log('this.get_report',res);
      if(res.authorization)
      {
        console.log('this.get_report', res.report);
          this.retrieveFile(res.report);
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
    console.log('ionViewDidLoad AdminHomePage');
    this.getCompetition();
  }

}
