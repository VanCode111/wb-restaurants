import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, ReplaySubject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

export interface RestaurantsApiResponse {
  data: Restaurant[];
  length: number;
}

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  address: string;
  time: {
    weekdays: string;
    weekends: string;
  };
  kitchens: string[];
  rating: number;
  menuLink?: string;
  averageCheck: number;
  cost: number;
  comments: string[];
  mainKitchen: string;
}

export interface Favorites {
  restaurant: Restaurant
  restaurantId: String
  userId: String
}

export interface Review {
  createdAt: Date
  userId: string
  text: string
  rating: number
  restaurantId: string
  userName: string | null
  restaurantName: string
}

export interface ResponseFavorite {
  userId: string
  restaurant: Restaurant
  id: number
}

export type queryParams = {
  [x: string]: string | number
}

@Injectable({
  providedIn: 'root',
})
export class RestaurantsService {
  filter = (prefix: string, value: string) => value || undefined
  private data = new ReplaySubject<queryParams>(2)
  public readonly data$ = this.data.asObservable()
  private _loading = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this._loading.asObservable();

  constructor(private http: HttpClient) {
  }

  showLoader() {
    this._loading.next(true);
  }

  hideLoader() {
    this._loading.next(false);
  }

  getRestaurants(params?: queryParams): Observable<RestaurantsApiResponse> {
    return this.http.get<RestaurantsApiResponse>(`${environment.apiUrl}/restaurants?l=6`, {params})
  }

  getOneRestaurant(id: string): Observable<Restaurant> {
    return this.http.get<Restaurant>(`${environment.apiUrl}/restaurants/${id}`)
  }

  setParams(params: queryParams) {
    this.data.next(params)
  }

  checkNulls(value: any) {
    return value ? value : null;
  }


  setFavoriteRestaurant(userId: string, restaurant: Restaurant): Observable<ResponseFavorite> {
    let requestBody = {
      userId: userId,
      restaurantId: restaurant.id,
      restaurant: restaurant
    }
    return this.http.post<ResponseFavorite>(`${environment.apiUrl}/favorites`, requestBody)
  }

  getFavoriteRestaurant(userId: string, restaurantId: string): Observable<ResponseFavorite[]> {
    const params = {
      userId: userId,
      restaurantId: restaurantId
    }
    return this.http.get<ResponseFavorite[]>(`${environment.apiUrl}/favorites`, {params})
  }

  getFavoriteRestaurants(userId: string): Observable<Favorites[]> {
    const params = {
      userId: userId,
    };
    return this.http.get<Favorites[]>(`${environment.apiUrl}/favorites`, {
      params,
    });
  }

  deleteFavoriteRestaurant(id: number): Observable<ResponseFavorite> {
    return this.http.delete<ResponseFavorite>(`${environment.apiUrl}/favorites/${id}`)
  }

  addReviewOnServer(review: Review): Observable<Review> {
    const requestBody = {
      createdAt: review.createdAt,
      userId: review.userId,
      text: review.text,
      rating: review.rating,
      restaurantId: review.restaurantId,
      userName: review.userName,
      restaurantName: review.restaurantName
    }
    return this.http.post<Review>(`${environment.apiUrl}/comments`, review)
  };

  getReviews(restaurantId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${environment.apiUrl}/comments?${restaurantId}`);
  }
}
