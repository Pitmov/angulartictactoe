import {NgModule} from '@angular/core';
import {WorkerAppModule} from '@angular/platform-webworker';
import {CommonModule} from '@angular/common';

import {AppComponent} from './app.component';
import {GameService} from "./game.service";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    WorkerAppModule,
    CommonModule
  ],
  providers: [GameService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
