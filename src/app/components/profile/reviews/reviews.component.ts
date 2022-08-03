import { User } from '@angular/fire/auth';
import {
  RestaurantsService,
  Review,
} from './../../../services/restaurants.service';
import { Component, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
})
export class ReviewsComponent implements OnInit {
  @Input() user: User;

  cols: number[] = [0, 1, 2];
  loading: boolean = false;
  reviews: Review[] = [];
  sortedReviews: Review[][];

  constructor(private restaurantsService: RestaurantsService) {}

  applyEditedReview(review: Review): void {
    this.reviews = this.reviews.map((reviewCurr) =>
      reviewCurr.id === review.id ? review : reviewCurr
    );
    this.sortedReviews = this.sortReviews(this.reviews, 3);
  }

  deleteReview(id: string): void {
    this.reviews = this.reviews.filter((reviewCurr) => reviewCurr.id !== id);
    this.sortedReviews = this.sortReviews(this.reviews, 3);
  }

  sortReviews(reviews: Review[], amountCols: number): Review[][] {
    let cols: Review[][] = [];
    reviews.forEach((review, idx) => {
      if (!cols[idx % amountCols]) {
        cols[idx % amountCols] = [];
      }
      cols[idx % amountCols].push(review);
    });
    return cols;
  }

  ngOnInit(): void {
    this.loading = true;
    const reviewsSubscription = this.restaurantsService
      .getReviews(undefined, this.user.uid)
      .subscribe({
        next: (reviews) => {
          this.reviews = reviews;
          this.sortedReviews = this.sortReviews(reviews, 3);
          console.log(reviews);
          reviewsSubscription.unsubscribe();
        },
      });
    this.restaurantsService.editedReview.subscribe((review: Review | null) => {
      if (review) {
        this.applyEditedReview(review);
      }
    });

    this.restaurantsService.deletedReviews.subscribe((id: string | null) => {
      if (id) {
        this.deleteReview(id);
      }
    });
  }
}
