import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EndStagePage } from './end-stage';

@NgModule({
  declarations: [
    EndStagePage,
  ],
  imports: [
    IonicPageModule.forChild(EndStagePage),
  ],
})
export class EndStagePageModule {}
