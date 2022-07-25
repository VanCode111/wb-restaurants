import {Component, OnInit} from '@angular/core';
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  pageEvent: PageEvent | undefined;

  constructor() {
    document.title = 'Рестораны';
  }

  ngOnInit(): void {
  }

}
