import {
  Review,
  RestaurantsService,
} from './../../../../services/restaurants.service';
import { Component, OnInit, Input } from '@angular/core';
import { startAfter } from '@firebase/firestore';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
})
export class ReviewComponent implements OnInit {
  @Input() review: Review;

  isEdit: boolean = false;

  constructor(private restaurantsService: RestaurantsService) {}

  changeMode(isEdit: boolean): void {
    this.isEdit = isEdit;
  }

  ngOnInit(): void {}
}
