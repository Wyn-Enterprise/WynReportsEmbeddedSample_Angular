import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { getReportList } from './library';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'WynReportsEmbeddedSample';
  isViewer = true;
  token = '';
  serverUrl = '';
  username = '';
  reportID = '';
  docTitle = '';
  reportType: string;
  visible = false;
  newReport: boolean;
  reportsList: any;

  constructor(private cd: ChangeDetectorRef) { }

  async ngOnInit() {

  }

  handleSubmit = async (serverUrl: string, token: string, username: string) => {
    const re = /\/$/;
    this.serverUrl = serverUrl.replace(re, "");
    this.token = token;
    this.username = username;
    this.reportsList = await getReportList(this.serverUrl, this.token);
    this.cd.detectChanges();
  }

  handleLogout = () => {
    this.token = '';
    this.reportID = '';
    this.docTitle = '';
    this.cd.detectChanges();
  }

  reportSelected = (reportID, docTitle) => {
    this.reportID = reportID;
    this.docTitle = docTitle;
    this.isViewer = true;
    this.visible = !this.visible;
    this.cd.detectChanges();
  }

  createRDLReport = () => {
    this.reportType = "CPL";
    this.newReport = true;    
    this.isViewer = false;
    this.cd.detectChanges();
  }

  createPageReport = () => {    
    this.reportType = "FPL";
    this.newReport = true;
    this.isViewer = false;
    this.cd.detectChanges();
  }

  openReportInDesigner = () => {
    this.newReport = false;
    this.isViewer = false;
    this.cd.detectChanges();
  }

  toggleVisible = () => {
    this.visible = !this.visible;
  }
}
