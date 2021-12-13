import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ReportViewerComponent } from './report-viewer/report-viewer.component';
import { ReportsListComponent } from './reports-list/reports-list.component';
import { ReportDesignerComponent} from './report-designer/report-designer.component'

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    ReportViewerComponent,
    ReportsListComponent,
    ReportDesignerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
