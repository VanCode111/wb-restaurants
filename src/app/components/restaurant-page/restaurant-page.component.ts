import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from 'src/app/services/auth.service';
import {ActivatedRoute} from "@angular/router";
import {Restaurant, RestaurantsService} from "../../services/restaurants.service";
import {forkJoin, Subscription} from "rxjs";
import {User} from "@angular/fire/auth";
import {ToastrService} from 'ngx-toastr';
import { Review} from "../../services/restaurants.service";

@Component({
  selector: 'app-restaurant-page',
  templateUrl: './restaurant-page.component.html',
  styleUrls: ['./restaurant-page.component.scss']
})
export class RestaurantPageComponent implements OnInit, OnDestroy {
  subscriptionRestaurants$: Subscription | null = null
  subscriptionUser$: Subscription | null = null
  subscriptionSetFavorite$: Subscription | null = null
  subscriptionDeleteFavorite$: Subscription | null = null
  subscriptionAddReviews$: Subscription | null = null
  subscriptionReviews$: Subscription | null = null
  restaurant: Restaurant
  starArray: number[]
  panelOpenState = false
  loading: boolean
  id: string
  currentUser: User | null = null;
  followButtonState: boolean = false
  followButtonText: string
  followId: string
  reviewRate: number
  reviewText: string = ""
  reviews: Review[]
  rates = [
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
              private toastr: ToastrService) {
    this.loading = false;
    this.id = activateRoute.snapshot.params['id']
    this.followButtonText = "Добавить в 'Хочу посетить'"
  }

  ngOnInit(): void {

    // forkJoin(
    //   {
    //     auth: this.authService.currentUser$.pipe(),//Обработка ошибки,
    //     oneRestaurant: this.restaurantsService.getOneRestaurant(this.id),
    //     favoriteRestaurant: this.restaurantsService.getFavoriteRestaurant(this.currentUser!.uid, this.restaurant.id)
    //   }).subscribe((respone: any) => {
    //   this.currentUser = respone.auth;
    //
    //   if (respone.favoriteRestaurant.length()) {
    //     this.followButtonState = (!!respone.favoriteRestaurant)
    //     this.followId = respone.favoriteRestaurant.id
    //   }
    // })

    this.loading = true;

    this.subscriptionUser$ = this.authService.currentUser$.subscribe((user: User | null) => {
      this.currentUser = user;
      // this.restaurantsService.getFavoriteRestaurant(user!.uid, this.restaurant.id) // ne vidit restoran
      //   .subscribe((data: any) => {
      //     if (data.length()) {
      //       this.followButtonState = (!!data)
      //       this.followId = data.id
      //     }
      //   })
    });

    this.subscriptionRestaurants$ = this.restaurantsService.getOneRestaurant(this.id).subscribe((data) => {
        this.restaurant = data
        this.starArray = new Array(Math.floor(this.restaurant.rating))
        this.loading = false;
      }
    )
    this.subscriptionReviews$ = this.restaurantsService.getReviews().subscribe(array => {this.reviews = array})


  }

  addFollowRestaurant(): void {
    if (!this.currentUser) {
      this.toastr.error('Для добавления ресторана в раздел "Хочу посетить" необходимо войти в систему',
        'Неавторизованный пользователь');
      return
    }
    if (!this.followButtonState) {
      this.subscriptionSetFavorite$ = this.restaurantsService.setFavoriteRestaurant(this.currentUser.uid, this.restaurant).subscribe(
        (value: any) => {
          this.followButtonState = true
          this.toastr.success('Ресторан успешно добавлен в раздел "Хочу посетить"', "Успех")
          this.followButtonText = "Удалить из раздела 'Хочу посетить'"
          this.followId = value.id
        },
        err => {
          this.toastr.error('Не удалось добавить ресторан в "Хочу посетить"', "Неудача")
        }
      )
    } else {
      this.subscriptionDeleteFavorite$ = this.restaurantsService.deleteFavoriteRestaurant(this.followId).subscribe(
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

    const review: Review = {
      rating: this.reviewRate,
      restaurantId: this.restaurant.id,
      text: this.reviewText,
      userId: this.currentUser!.uid.toString(),
      createdAt: new Date()
    }

    if (!this.reviewRate || !this.reviewText){
      this.toastr.warning('Заполните все поля', "Предупреждение")
      return
    }
    this.subscriptionAddReviews$ = this.restaurantsService.addReviewOnServer(review).subscribe(() => {
        this.toastr.success('Отзыв успешно добавлен', "Успех")
    },
      error => {
        this.toastr.error('Не удалось добавить отзыв', "Неудача")
      })
  }

  ngOnDestroy(): void {
    this.subscriptionRestaurants$?.unsubscribe()
    this.subscriptionUser$?.unsubscribe();
    this.subscriptionSetFavorite$?.unsubscribe()
    this.subscriptionDeleteFavorite$?.unsubscribe()
    this.subscriptionAddReviews$?.unsubscribe()
    this.subscriptionReviews$?.unsubscribe()
  }
}
