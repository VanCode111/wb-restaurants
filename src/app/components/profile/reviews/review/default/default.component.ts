import { RestaurantsService } from './../../../../../services/restaurants.service';
import { getStarsByRating } from './../../../../../utils/reviews';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Review } from 'src/app/services/restaurants.service';

@Component({
  selector: 'review-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss'],
})
export class DefaultComponent implements OnInit {
  @Input() review: Review;
  @Output() changeMode: EventEmitter<boolean> = new EventEmitter<boolean>();
  stars: string[];
  constructor(private restaurantsService: RestaurantsService) {}

  onChangeMode() {
    this.changeMode.emit(true);
  }

  deleteReview(): void {
    const id = this.review.id;
    if (!id) {
      return;
    }
    const deleteSubscription = this.restaurantsService
      .deleteReview(id)
      .subscribe(() => {
        deleteSubscription.unsubscribe();
        this.restaurantsService.deletedReviews.next(id);
      });
  }

  ngOnInit(): void {
    this.stars = getStarsByRating(this.review.rating);
  }
}
