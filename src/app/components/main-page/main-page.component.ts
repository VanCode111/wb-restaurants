import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  panelOpenState = true

  constructor() {
    document.title = 'Рестораны';
  }

  ngOnInit(): void {
  }

}
