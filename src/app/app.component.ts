import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { getReportList } from './library';
import { WynIntegration } from '@wynenterprise/wyn-integration';

import { SignInComponent } from './sign-in/sign-in.component';
import { ReportsListComponent } from './reports-list/reports-list.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    imports: [SignInComponent, ReportsListComponent]
})
export class AppComponent implements OnInit {
  loading = false;
  ins: any = null;

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

  constructor() { }

  async ngOnInit() {

  }

  handleSubmit = async (serverUrl: string, token: string, username: string) => {
    const re = /\/$/;
    this.serverUrl = serverUrl.replace(re, "");
    this.token = token;
    this.username = username;
    this.reportsList = await getReportList(this.serverUrl, this.token);
  }

  handleLogout = () => {
    this.token = '';
    this.reportID = '';
    this.docTitle = '';
  }

  reportSelected = (reportID, docTitle) => {
    this.reportID = reportID;
    this.docTitle = docTitle;
    this.ins?.destroy?.();
    this.createViewer();
  }

  clearContainer = () => {
    const container = document.querySelector('#wyn-root');
    if (container) container.innerHTML = '';
  }

  createViewer = () => {
    this.clearContainer();
    WynIntegration.createReportViewer({
      baseUrl: this.serverUrl,
      reportId: this.reportID,
      //theme: 'red',
      token: this.token,
      // for v5.0, v5.1 ignore
      //version: '5.0.21782.0',
    }, '#wyn-root').then(ins => {
      this.ins = ins;
      this.loading = false;
    });
  }

  createRDLReport = () => {
    this.ins?.destroy?.();
    this.clearContainer();
    this.reportType = "CPL";
    this.reportID = '';
    this.createDesigner();
  }

  createPageReport = () => {
    this.ins?.destroy?.();
    this.clearContainer();
    this.reportType = "FPL";
    this.reportID = '';
    this.createDesigner();
  }

  openReportInDesigner = () => {
    this.ins?.destroy?.();
    this.clearContainer();
    this.createDesigner();
  }

  onSavedReport = (report) => {
    const index = this.reportsList.findIndex(x => report.id === x.id || report.name === x.name);
    if (index === -1) {
      this.reportsList.push(report);
      this.sortReports();
    }
  }

  sortReports = () => {
    this.reportsList = this.reportsList.sort((x, y) => x.name.localeCompare(y.name));
  };

  openViewer = (options) => {
    console.log(options);
    this.ins?.destroy?.();
    WynIntegration.createReportViewer({
      baseUrl: this.serverUrl,
      reportId: this.reportID,
      //theme: 'red',
      token: this.token,
      // for v5.0, v5.1 ignore
      //version: '5.0.21782.0',
    }, '#wyn-root').then(ins => {
      this.ins = ins;
      this.loading = false;
    });
  };

  createDesigner = () => {
    WynIntegration.createReportDesigner({
      baseUrl: this.serverUrl,
      reportId: this.reportID,
      token: this.token,
      onSaved: this.onSavedReport,
      makeTitle: (reportName, options) => {
        const title = `${reportName}${options.dirty ? ' *' : ''}`;
        return title;
      },
      // for v5.0, v5.1 ignore
      //version: '5.0.21782.0',
    }, '#wyn-root').then(ins => {
      this.ins = ins;
      this.ins.closeViewer();
      const reportType = this.reportType
      this.ins.api.createReport({ reportType });
      this.loading = false;
    });
  }
}
