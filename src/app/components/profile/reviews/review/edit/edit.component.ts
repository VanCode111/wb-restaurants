import { getStarsByRating } from './../../../../../utils/reviews';
import { RestaurantsService } from './../../../../../services/restaurants.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Review } from 'src/app/services/restaurants.service';

@Component({
  selector: 'review-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  @Input() review: Review;
  @Output() changeMode: EventEmitter<boolean> = new EventEmitter<boolean>();
  stars: string[] = [];
  rating: number;
  text: string;

  constructor(private restaurantsService: RestaurantsService) {}

  onChangeMode() {
    this.changeMode.emit(false);
  }

  changeRating(rating: number) {
    this.rating = rating;
    this.stars = getStarsByRating(rating);
  }

  saveChanges(): void {
    if (!this.review.id) {
      return;
    }
    this.restaurantsService
      .editReview({
        id: this.review.id,
        text: this.text,
        rating: this.rating,
        createdAt: new Date(),
      })
      .subscribe((review: Review) => {
        this.changeMode.emit(false);
        this.restaurantsService.setEditReview(review);
      });
  }

  ngOnInit(): void {
    this.text = this.review.text;
    this.rating = this.review.rating;
    this.stars = getStarsByRating(this.review.rating);
  }
}
