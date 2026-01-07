import { Component, OnInit, input, signal } from '@angular/core';


@Component({
  selector: 'reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.css'],
  imports: []
})
export class ReportsListComponent implements OnInit {

  selectedReport = signal<any>(null);
  reportID = signal("");
  rptIconSrc = "assets/report.svg";

  reportSelectedCallbackFn = input<(reportID, title) => void>();
  token = input<string>();
  serverUrl = input<string>();
  reportsList = input<any>();

  constructor() { }

  ngOnInit(): void {

  }

  onClick = (rpt: any) => {
    console.log(rpt);
    this.selectedReport.set(rpt);
    // @ts-ignore
    this.reportSelectedCallbackFn()(rpt.id, rpt.name);
  }

  getIconSrc = (rpt: any) => {
    return this.rptIconSrc;
  }
}
