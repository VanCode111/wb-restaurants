import {Injectable} from '@angular/core';
import {collection, Firestore, collectionSnapshots} from "@angular/fire/firestore";
import {map, Observable, Subject} from "rxjs";
import {Restaurant} from "../components/restaurants-list/restaurants-list.component";
import {AngularFirestore} from "@angular/fire/compat/firestore";


@Injectable({
  providedIn: 'root'
})
export class RestaurantsService {

  rests = new Subject()

  constructor(private firestore: Firestore, private afs: AngularFirestore) {
  }

  getAllRestaurants(): Observable<Restaurant[]> {
    return collectionSnapshots(collection(this.firestore, 'restaurants'))
      .pipe(map((list) => list.map(item => ({id: item.id, ...item.data()} as Restaurant))))
  }

  fireQuery(start: string, end: string) {
    return this.afs
      .collection(
        'restaurants',
        ref => ref.limit(10).orderBy('name').startAt(start).endAt(end)
      ).valueChanges()
  }
}
