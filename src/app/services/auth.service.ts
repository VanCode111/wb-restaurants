import { Injectable } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  User,
  UserCredential,
} from '@angular/fire/auth';
import { FirebaseStorage, StorageInstances } from '@angular/fire/storage';
import { BehaviorSubject, from, Observable, switchMap } from 'rxjs';

export interface ISignIn {
  email: string;
  password: string;
  name: string;
}

export interface ISignUp extends ISignIn {
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser$ = authState(this.auth);

  constructor(private auth: Auth) {}

  signIn({ email, password }: ISignIn): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  signUp({ email, password, name }: ISignIn): Observable<void> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password)
    ).pipe(
      switchMap(({ user }) => from(updateProfile(user, { displayName: name })))
    );
  }

  logout(): Observable<void> {
    return from(this.auth.signOut());
  }
}
