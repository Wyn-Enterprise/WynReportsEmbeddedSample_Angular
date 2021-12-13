import { Component, Input, OnInit } from '@angular/core';
declare var GrapeCity: any;

@Component({
  selector: 'sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  serverUrl: string;
  username: string;
  password: string;
  error: string;

  @Input() handleSubmitCallbackFunction: (url: string, token: string, username : string) => void;

  constructor() { }

  ngOnInit(): void {
    this.serverUrl = "http://localhost:51980";
    this.username = "admin";
  }

  async onSubmit() {
    const token = await GrapeCity.WynReports.getReferenceToken(this.serverUrl, this.username, this.password);
    if (token) {
      this.handleSubmitCallbackFunction(this.serverUrl, token, this.username);
    } else {
      this.error = "Authorization error";
    }
  }
}
