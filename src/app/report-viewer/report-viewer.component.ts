import { Component, Input, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { getReportingInfo } from '../library';
declare var GrapeCity: any;

@Component({
  selector: 'report-viewer',
  templateUrl: './report-viewer.component.html',
  styleUrls: ['./report-viewer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportViewerComponent implements OnInit, OnDestroy {
  viewer: any;

  @Input() token: string;
  @Input() serverUrl: string;
  @Input() logoutCallbackFn: (token: string) => void;
  @Input() docTitle: string;
  @Input() reportId: string;

  constructor() { }

  ngOnInit(): void {

  }

  ngOnDestroy() {
    this.viewer.destroy();
  }

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

  addViewerCssLink = (portalUrl, pluginVersion, theme) => {
    const themeSuffix = theme !== 'default' ? `.${theme}` : '';
    const viewerCssUrl = this.concatUrls(portalUrl, `api/pluginassets/reports-${pluginVersion}/viewer-app${themeSuffix}.css`);
    this.addCssLink(viewerCssUrl);
  };

  async ngOnChanges(changes: any) {
    if (changes.reportId != null && changes.reportId.currentValue != null) {

      if (!this.viewer) {
        const info = await getReportingInfo(this.serverUrl, this.token);
        this.addViewerCssLink(this.serverUrl, info.pluginVersion, info.theme);

        let serverUrl = this.serverUrl;
        let token = this.token;
        this.viewer = GrapeCity.WynReports.Viewer.create({
          element: 'report-viewer-app',
          portalUrl: serverUrl,
          referenceToken: token,
          locale: info.locale,
          makeTitle: (reportName) => reportName
        });
      }
      if (changes.reportId.currentValue != "")
        await this.viewer.openReport(changes.reportId.currentValue);
    }
  }
}
