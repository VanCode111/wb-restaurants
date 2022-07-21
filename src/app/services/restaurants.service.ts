import { Injectable } from '@angular/core';
import {collection, collectionData, Firestore} from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root'
})
export class RestaurantsService {

  constructor(private firestore: Firestore) { }

  getAllRestaurants() {
    return collectionData(collection(this.firestore, 'restaurants'))
  }
}
