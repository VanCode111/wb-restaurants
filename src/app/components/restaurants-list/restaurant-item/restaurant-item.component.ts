import {Component, Input, OnInit} from '@angular/core';
import {Restaurant} from "../../../services/restaurants.service";

@Component({
  selector: 'app-restaurant-item',
  templateUrl: './restaurant-item.component.html',
  styleUrls: ['./restaurant-item.component.scss']
})
export class RestaurantItemComponent implements OnInit {
  @Input() item: Restaurant | null = null
  @Input() isList: boolean = false
  stars: any[] = new Array(5)

  constructor() {
  }

  ngOnInit(): void {
  }
}
