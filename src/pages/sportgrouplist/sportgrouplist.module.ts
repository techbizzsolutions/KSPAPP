import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SportgrouplistPage } from './sportgrouplist';

@NgModule({
  declarations: [
    SportgrouplistPage,
  ],
  imports: [
    IonicPageModule.forChild(SportgrouplistPage),
  ],
})
export class SportgrouplistPageModule {}
