import { Injectable } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
  UserCredential,
} from '@angular/fire/auth';
import { BehaviorSubject, from, Observable } from 'rxjs';

export interface ISignIn {
  email: string;
  password: string;
}

export interface ISignUp extends ISignIn {
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser = authState(this.auth);
  curr = new BehaviorSubject<null | User>(null);

  constructor(private auth: Auth) {
    this.currentUser.subscribe((user) => this.curr.next(user));
  }

  get currentUser$() {
    return this.curr;
  }

  signIn({ email, password }: ISignIn): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  signUp({ email, password }: ISignIn): Observable<UserCredential> {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  logout(): Observable<void> {
    return from(this.auth.signOut());
  }
}
