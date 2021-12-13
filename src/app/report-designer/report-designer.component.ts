import { Component, Input, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { getReportingInfo } from '../library';
declare var GrapeCity: any;

@Component({
  selector: 'report-designer',
  templateUrl: './report-designer.component.html',
  styleUrls: ['./report-designer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportDesignerComponent implements OnInit, OnDestroy {
  viewer: any;

  @Input() token: string;
  @Input() serverUrl: string;
  @Input() docTitle: string;
  @Input() reportId: string;
  @Input() reportType: string;
  @Input() newReport: boolean;
  @Input() reportsList: any;
  @Input() isViewer: boolean;
  @Input() initializeDesigner: boolean;

  constructor() { }

  async ngOnInit() {

  }

  ngOnDestroy() {
    GrapeCity.WynReports.Designer.destroy();
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

  concatUrls = (...urls) => {
    const skipNullOrEmpty = (value) => !!value;
    const trimLeft = (value, char) => (value.substr(0, 1) === char ? value.substr(1) : value);
    const trimRight = (value, char) => (value.substr(value.length - 1) === char ? value.substr(0, value.length - 1) : value);
    return urls
      .map(x => x && x.trim())
      .filter(skipNullOrEmpty)
      .map((x, i) => (i > 0 ? trimLeft(x, '/') : x))
      .map((x, i, arr) => (i < arr.length - 1 ? trimRight(x, '/') : x))
      .join('/');
  };

  addCssLink = (cssUrl) => {
    const head = document.getElementsByTagName('head')[0];
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = cssUrl;
    head.appendChild(link);
  };

  addDesignerAndViewerCssLinks = (portalUrl, pluginVersion, theme) => {
    const themeSuffix = theme !== 'default' ? `.${theme}` : '';
    const viewerCssUrl = this.concatUrls(portalUrl, `api/pluginassets/reports-${pluginVersion}/viewer-app${themeSuffix}.css`);
    const designerCssUrl = this.concatUrls(portalUrl, `api/pluginassets/reports-${pluginVersion}/designer-app${themeSuffix}.css`);

    this.addCssLink(viewerCssUrl);
    this.addCssLink(designerCssUrl);
  };

  async ngOnChanges(changes: any) {
    if (changes.isViewer != null)
      this.initializeDesigner = true;
    else
      this.initializeDesigner = false;

    this.openDesigner();

  }

  async openDesigner() {
    if (this.initializeDesigner) {

      const info = await getReportingInfo(this.serverUrl, this.token);
      this.addDesignerAndViewerCssLinks(this.serverUrl, info.pluginVersion, info.theme);

      const designerOptions = GrapeCity.WynReports.Designer.createDesignerOptions(this.serverUrl, this.token);
      designerOptions.locale = info.locale;
      designerOptions.onSaved = this.onSavedReport;

      designerOptions.makeTitle = (reportName, options) => {
        const title = `${reportName}${options.dirty ? ' *' : ''}`;
        return title;
      };

      let viewer;
      designerOptions.openViewer = (options) => {
        if (!viewer) {
          viewer = GrapeCity.WynReports.Viewer.create({
            element: options.element,
            portalUrl: this.serverUrl,
            referenceToken: this.token,
            locale: options.locale,
          });
        }
        viewer.openReport(options.reportInfo.id);
      };

      await GrapeCity.WynReports.Designer.renderApplication('report-designer-app', designerOptions);
    }

    if (this.newReport == true) {
      GrapeCity.WynReports.Designer.closeViewer();
      GrapeCity.WynReports.Designer.api.createReport({
        reportType: (this.reportType || '').toUpperCase() === 'FPL' ? 'FPL' : 'CPL',
      });
    }
    else {
      GrapeCity.WynReports.Designer.closeViewer();
      const reportInfo = {
        id: this.reportId,
        name: this.docTitle,
        permissions: ['all'],
      };
      GrapeCity.WynReports.Designer.api.openReport({ reportInfo });
    }
  }
}
