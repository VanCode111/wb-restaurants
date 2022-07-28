import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, ReplaySubject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

export interface RestaurantsApiResponse {
  data: Restaurant[]
  length: number
}

export interface Restaurant {
  id: string
  name: string
  image: string
  address: string
  time: {
    weekdays: string
    weekends: string
  }
  kitchens: string[]
  rating: number
  menuLink?: string
  averageCheck: number
  cost: number
  comments: string[]
  mainKitchen: string
}

export type queryParams = {
  [x: string]: string | number
}

@Injectable({
  providedIn: 'root'
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
    return this.http.get<RestaurantsApiResponse>(`${environment.apiUrl}/restaurants?p=1&l=6`, {params})
  }

  getOneRestaurant(id: string): Observable<Restaurant> {
    return this.http.get<Restaurant>(`${environment.apiUrl}/restaurants/${id}`)
  }

  setParams(params: queryParams) {
    this.data.next(params)
  }

  checkNulls(value: any) {
    return value ? value : null
  }
}
