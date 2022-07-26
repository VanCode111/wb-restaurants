import { Router } from '@angular/router';
import { AuthService } from './../../../services/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize, Observer, Subscription } from 'rxjs';
import { FirebaseError } from '@angular/fire/app';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss', '../auth-main.scss'],
})
export class SigninComponent implements OnInit {
  hide = true;
  signInForm!: FormGroup;
  error!: string;
  isLoading = false;
  userSub$: Subscription;
  constructor(private AuthService: AuthService, private router: Router) {
    document.title = 'Авторизация';
    this._createForm();
  }

  ngOnInit(): void {}

  private _createForm() {
    this.signInForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
    });
  }

  submit(): void {
    this.isLoading = true;
    this.userSub$ = this.AuthService.signIn(this.signInForm.getRawValue())
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          this.router.navigate(['restaurants']);
        },
        error: (err: FirebaseError) => {
          this.error = err.message;
        },
      });
  }

  OnDestroy() {
    this.userSub$.unsubscribe();
  }

  get email() {
    return this.signInForm.get('email');
  }

  get password() {
    return this.signInForm.get('password');
  }
}
