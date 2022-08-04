import { Subscription } from 'rxjs';
import { User } from '@angular/fire/auth';
import {
  RestaurantsService,
  Review,
} from './../../../services/restaurants.service';
import { Component, Input, OnInit, Output, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
})
export class ReviewsComponent implements OnInit, OnDestroy {
  @Input() user: User;

  cols: number[] = [0, 1, 2];
  loading: boolean = false;
  reviews: Review[] = [];
  sortedReviews: Review[][];

  editedSub$: Subscription;
  deletedSub$: Subscription;

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
      const colNumber = idx % amountCols;
      if (!cols[colNumber]) {
        cols[colNumber] = [];
      }
      cols[colNumber].push(review);
    });
    return cols;
  }

  ngOnInit(): void {
    this.loading = true;
    this.restaurantsService.getReviews(undefined, this.user.uid).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.sortedReviews = this.sortReviews(reviews, 3);
      },
    });
    this.editedSub$ = this.restaurantsService.editedReview.subscribe(
      (review: Review | null) => {
        if (review) {
          this.applyEditedReview(review);
        }
      }
    );

    this.deletedSub$ = this.restaurantsService.deletedReviews.subscribe(
      (reviewId: string | null) => {
        if (reviewId) {
          this.deleteReview(reviewId);
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.editedSub$.unsubscribe();
    this.deletedSub$.unsubscribe();
  }
}
