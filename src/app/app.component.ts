import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { getReportList } from './library';
import { WynIntegration } from '@grapecity/wyn-integration';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
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

  createViewer = () => {
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
    this.reportType = "CPL";
    this.reportID = '';
  }

  createPageReport = () => {
    this.ins?.destroy?.();
    this.reportType = "FPL";
    this.reportID = '';
  }

  openReportInDesigner = () => {
    this.ins?.destroy?.();
    this.createDesigner();
  }

  onSavedReport = (report) => {
    let index = this.reportsList.findIndex(x => report.id === x.id || report.name === x.name);
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
      reportViewer: { disabled: false },
      makeTitle: (reportName, options) => {
        const title = `${reportName}${options.dirty ? ' *' : ''}`;
        return title;
      },
      // for v5.0, v5.1 ignore
      //version: '5.0.21782.0',
    }, '#wyn-root').then(ins => {
      this.ins = ins;
      console.log(this.ins);
      this.ins.closeViewer();
      const reportInfo = {
        id: this.reportID,
        name: this.docTitle,
        permissions: ['all'],
      };
      this.ins.api.openReport({ reportInfo });

      this.loading = false;
    });
  }
}
