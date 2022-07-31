import { Review } from './../../../../services/restaurants.service';
import { Component, OnInit, Input } from '@angular/core';
import { startAfter } from '@firebase/firestore';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
})
export class ReviewComponent implements OnInit {
  @Input() review: Review;
  stars: string[] = [];

  constructor() {}

  private _generateStars() {
    const stars: string[] = [];
    let rating = this.review.rating;
    for (let i = 0; i < 5; i++) {
      if (rating >= 1) {
        stars.push('star');
      } else if (rating >= 0.5) {
        stars.push('star_half');
      } else {
        stars.push('star_border');
      }
      rating--;
    }
    return stars;
  }

  ngOnInit(): void {
    this.stars = this._generateStars();
  }
}
