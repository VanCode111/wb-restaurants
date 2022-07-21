import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss', '../auth-main.scss'],
})
export class SigninComponent implements OnInit {
  hide = true;
  constructor() {
    document.title = 'Авторизация';
  }

  ngOnInit(): void {}
}
