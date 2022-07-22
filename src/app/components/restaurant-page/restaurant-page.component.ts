import {Component, OnInit} from '@angular/core';


@Component({
  selector: 'app-restaurant-page',
  templateUrl: './restaurant-page.component.html',
  styleUrls: ['./restaurant-page.component.scss']
})
export class RestaurantPageComponent implements OnInit {
  panelOpenState = false

  constructor() {
  }

  ngOnInit(): void {
  }

}
