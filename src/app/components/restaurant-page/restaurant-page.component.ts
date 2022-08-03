import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AuthService} from 'src/app/services/auth.service';
import {ActivatedRoute} from "@angular/router";
import {
  ExtraReview,
  ResponseFavorite,
  Restaurant,
  RestaurantsService,
  Review
} from "../../services/restaurants.service";
import {catchError, first, forkJoin, map, mergeMap, Observable, of} from "rxjs";
import {User} from "@angular/fire/auth";
import {ToastrService} from 'ngx-toastr';
import {getStarsByRating} from "../../utils/reviews";


@Component({
  selector: 'app-restaurant-page',
  templateUrl: './restaurant-page.component.html',
  styleUrls: ['./restaurant-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class RestaurantPageComponent implements OnInit {
  // // subscriptionRestaurants$: Subscription | null = null
  // // subscriptionUser$: Subscription | null = null
  // // subscriptionReviews$: Subscription | null = null
  // subscriptionSetFavorite$: Subscription | null = null
  // subscriptionDeleteFavorite$: Subscription | null = null
  // subscriptionAddReviews$: Subscription | null = null
  // // subscriptionFavoriteRestaurant$: Subscription | null = null
  // subscriptionChangeReviews$: Subscription | null = null
  // subscriptionDeleteReviews$: Subscription | null = null

  subscribeReviews$: Observable<Review[]>

  restaurant: Restaurant
  starArray: string[]
  panelOpenState = false
  loading: boolean
  restaurantId: string
  currentUser: User | null = null;
  followButtonState: boolean = false
  followButtonText: string
  followId: number
  reviewRate: number
  reviewText: string = ""
  reviews: Review[]
  mapLink: string;
  stateReviewButton: boolean = true
  reviewRatingMap: Map<string, string[]> = new Map()
  reviewExtraMap: Map<string, ExtraReview[]> = new Map()
  existUserReview: boolean = false
  idUserReview: string
  RATES = [
    {value: '1'},
    {value: '1.5'},
    {value: '2'},
    {value: '2.5'},
    {value: '3'},
    {value: '3.5'},
    {value: '4'},
    {value: '4.5'},
    {value: '5'},
  ]

  constructor(private authService: AuthService,
              private activateRoute: ActivatedRoute,
              private restaurantsService: RestaurantsService,
              private toastr: ToastrService,
              private cdr: ChangeDetectorRef) {
    this.loading = false;
    this.restaurantId = activateRoute.snapshot.params['id']
    this.followButtonText = "Добавить в 'Хочу посетить'"
  }

  ngOnInit(): void {

    this.loading = true;
    this.subscribeReviews$ = this.restaurantsService.getReviews(this.restaurantId)
    forkJoin([
      this.restaurantsService.getOneRestaurant(this.restaurantId)
        .pipe(map(restaurant => {
          this.restaurant = restaurant
          this.starArray = getStarsByRating(this.restaurant.rating);
          this.mapLink = `https://yandex.ru/maps/?text=${this.restaurant.address}`
        })),
      this.authService.currentUser$.pipe(
        map((user: User | null) => {
          this.currentUser = user
        }),
        mergeMap(() => {
          return this.restaurantsService.getFavoriteRestaurant(this.currentUser!.uid, this.restaurantId)
        }),
        map((favorite: ResponseFavorite[]) => {
          let isRestaurantId = false
          favorite.forEach((favorite: ResponseFavorite) => {
            isRestaurantId = favorite.restaurantId === this.restaurantId.toString()
            if (isRestaurantId) {
              this.followId = favorite.id
              return
            }
          })
          if (favorite.length && isRestaurantId) {
            this.followButtonState = true
            this.followButtonText = "Удалить из раздела 'Хочу посетить'"
          }
        })
      ),
      this.subscribeReviews$.pipe(map((reviews) => {
        this.reviews = reviews
        if (this.reviews) {
          this.reviews.forEach((element: Review) => {
            if (element.id) {
              this.reviewRatingMap.set(element.id, getStarsByRating(element.rating))
              if (element.extra) {
                this.reviewExtraMap.set(element.id, element.extra)
              }
            }
            if (element.userId === this.currentUser?.uid) {
              this.existUserReview = true
              this.reviewText = element.text
              this.reviewRate = element.rating
              if (element.id) {
                this.idUserReview = element.id
              }
            }
          })
        }
        this.loading = false;
      }))
    ])
      .pipe(catchError(error => of(error)))
      .subscribe(() => {
        },
        error => {
          console.log(error)
          this.toastr.error("Попробуйте обновить страницу", "Ошибка")
        }
      )
    // this.subscriptionRestaurants$ = this.restaurantsService.getOneRestaurant(this.restaurantId).subscribe((data) => {
    //     this.restaurant = data
    //     this.starArray = getStarsByRating(this.restaurant.rating);
    //     this.mapLink = `https://yandex.ru/maps/?text=${this.restaurant.address}`
    //     this.loading = false;
    //   }
    // )
    // this.subscriptionUser$ = this.authService.currentUser$.pipe(
    //   map((user: User | null) => this.currentUser = user),
    //   mergeMap(() => {
    //     return this.restaurantsService.getFavoriteRestaurant(this.currentUser!.uid, this.restaurantId)
    //   })
    // ).subscribe((favorite: ResponseFavorite[]) => {
    //   let isRestaurantId = false
    //   favorite.forEach((entity) => {
    //     isRestaurantId = entity.restaurantId == this.restaurantId.toString()
    //     if (isRestaurantId)
    //       return
    //   })
    //   if (favorite.length && isRestaurantId) {
    //     this.followButtonState = true
    //     this.followId = favorite[0].id
    //     this.followButtonText = "Удалить из раздела 'Хочу посетить'"
    //   }
    // });
    // this.subscriptionReviews$ = this.restaurantsService.getReviews(this.restaurantId)
    //   .subscribe((reviews) => {
    //   this.reviews = reviews
    //   if (this.reviews) {
    //     this.reviews.forEach((element: Review) => {
    //       if (element.id) {
    //         this.reviewRatingMap.set(element.id, getStarsByRating(element.rating))
    //       }
    //       if (element.userId === this.currentUser?.uid) {
    //         this.existUserReview = true
    //         this.reviewText = element.text
    //         this.reviewRate = element.rating
    //         if (element.id) {
    //           this.idUserReview = element.id
    //         }
    //       }
    //     })
    //   }
    //   }
    // )


  }

  addFollowRestaurant(): void {

    if (!this.currentUser) {
      this.toastr.error('Для добавления ресторана в раздел "Хочу посетить" необходимо войти в систему',
        'Неавторизованный пользователь');
      return
    }

    if (!this.followButtonState) {
      this.restaurantsService.setFavoriteRestaurant(this.currentUser.uid, this.restaurant).pipe(first()).subscribe(
        (favorite: ResponseFavorite) => {
          this.followButtonState = true
          this.toastr.success('Ресторан успешно добавлен в раздел "Хочу посетить"', "Успех")
          this.followButtonText = "Удалить из раздела 'Хочу посетить'"
          this.followId = favorite.id
        },
        err => {
          this.toastr.error('Не удалось добавить ресторан в "Хочу посетить"', "Неудача")
        }
      )
    } else {
      this.restaurantsService.deleteFavoriteRestaurant(this.followId).pipe(first()).subscribe(
        () => {
          this.followButtonState = false
          this.toastr.success('Ресторан успешно удалён из "Хочу посетить"', "Успех")
          this.followButtonText = "Добавить в 'Хочу посетить'"
        },
        err => {
          this.toastr.error('Не удалось удалить ресторан из "Хочу посетить"', "Неудача")
        }
      )
    }
  }


  addReview(): void {

    if (!this.reviewRate || !this.reviewText) {
      this.toastr.warning('Заполните все поля', "Предупреждение")
      return
    }
    this.stateReviewButton = false;

    const review: Review = {
      rating: this.reviewRate,
      restaurantId: this.restaurant.id,
      text: this.reviewText,
      userId: this.currentUser!.uid.toString(),
      createdAt: new Date(),
      userName: this.currentUser!.displayName,
      restaurantName: this.restaurant.name
    }

    this.restaurantsService.addReviewOnServer(review).pipe(first()).subscribe(() => {
        this.toastr.success('Отзыв успешно добавлен', "Успех")
        this.reviewRate = 0
        this.reviewText = ""
        this.stateReviewButton = true
      },
      error => {
        this.toastr.error('Не удалось добавить отзыв', "Неудача")
      })
    this.subscribeReviews$.pipe(first()).subscribe(reviews => {
      this.reviews = reviews;
    })
  }

  addExtraReview() {
    const extraReview = {
      text: this.reviewText,
      rating: this.reviewRate,
      id: this.idUserReview,
      createdAt: new Date(),
    }
    this.restaurantsService.addExtraReviewOnServer(extraReview).pipe(first()).subscribe(() => {
        this.toastr.success('Отзыв успешно добавлен', "Успех")
        this.reviewRate = 0
        this.reviewText = ""
        this.stateReviewButton = true
      },
      error => {
        this.toastr.error('Не удалось добавить отзыв', "Неудача")
      })
    this.subscribeReviews$.pipe(first()).subscribe(reviews => {
      this.reviews = reviews;
    })
  }


  changeReview() {
    if (!this.reviewRate || !this.reviewText) {
      this.toastr.warning('Заполните все поля', "Предупреждение")
      return
    }

    this.stateReviewButton = false;
    const changeReview = {
      text: this.reviewText,
      id: this.idUserReview,
      rating: this.reviewRate,
      createdAt: new Date(),
    }

    this.restaurantsService.editReview(changeReview).pipe(first()).subscribe(() => {
        this.toastr.success('Отзыв успешно обновлён', "Успех")
        this.stateReviewButton = true
      },
      error => {
        this.toastr.error('Не удалось обновить отзыв', "Неудача")
      })

  }

  deleteReview() {
    this.stateReviewButton = false;

    this.restaurantsService.deleteReview(this.idUserReview).pipe(first()).subscribe(() => {
        this.toastr.success('Отзыв успешно удалён', "Успех")
        this.reviewRate = 0
        this.reviewText = ""
        this.stateReviewButton = true
      },
      error => {
        this.toastr.error('Не удалось удалить отзыв', "Неудача")
      })
  }

}
