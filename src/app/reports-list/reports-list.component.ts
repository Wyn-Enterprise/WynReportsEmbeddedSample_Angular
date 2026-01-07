import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'reports-list',
    templateUrl: './reports-list.component.html',
    styleUrls: ['./reports-list.component.css'],
    standalone: false
})
export class ReportsListComponent implements OnInit {

  selectedReport: any;
  reportID = "";
  rptIconSrc = "assets/report.svg";

  @Input() reportSelectedCallbackFn: (reportID, title) => void;
  @Input() token: string;
  @Input() serverUrl: string;
  @Input() reportsList: any;

  constructor() { }

  ngOnInit(): void {    
    
  }

  onClick = (rpt: any) => {
    console.log(rpt);
    this.selectedReport = rpt;
    this.reportSelectedCallbackFn(rpt.id, rpt.name);
  }

  getIconSrc = (rpt: any) => {
      return this.rptIconSrc;
  }
}
