import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { TaskComponent } from './task/task.component';
import { ChatComponent } from './task/chat/chat.component';
import { DetailComponent } from './task/detail/detail.component';
import { TasksListComponent } from './task/tasks-list/tasks-list.component';
import { UserpicComponent } from './userpic/userpic.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    TaskComponent,
    ChatComponent,
    DetailComponent,
    TasksListComponent,
    UserpicComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
