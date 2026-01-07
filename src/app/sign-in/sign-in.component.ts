import { Component, Input, OnInit } from '@angular/core';
import Config from '../../assets/config.json';


@Component({
    selector: 'sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.css'],
    standalone: false
})
export class SignInComponent implements OnInit {

  serverUrl: string;
  username: string;
  password: string;
  error: string;

  @Input() handleSubmitCallbackFunction: (url: string, token: string, username: string) => void;

  constructor() { }

  ngOnInit(): void {
    this.serverUrl = Config.serverUrl;
    this.username = Config.username;
  }

  async onSubmit() {

    let token = '';
    const re = /\/$/;
    const baseUrl = this.serverUrl.replace(re, "");

    const urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "password");
    urlencoded.append("username", this.username);
    urlencoded.append("password", this.password);
    urlencoded.append("client_id", "integration");
    urlencoded.append("client_secret", "eunGKas3Pqd6FMwx9eUpdS7xmz");


    const response = await fetch(baseUrl + "/connect/token", {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      body: urlencoded // body data type must match "Content-Type" header
    });

    await response.json().then(res => {
      token = res.access_token;
      if (token) {
        this.handleSubmitCallbackFunction(this.serverUrl, token, this.username);
      } else {
        this.error = "Authorization error";
      }
    }).catch(err => {
      this.error = "Authorization error";
    });
  }
}
