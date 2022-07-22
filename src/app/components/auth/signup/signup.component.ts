import { Component, OnInit } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss', '../auth-main.scss'],
})
export class SignupComponent implements OnInit {
  hide = true;
  signUpForm!: FormGroup;
  error!: string;
  isLoading = false;
  user$!: Subscription;
  constructor(private AuthService: AuthService) {
    document.title = 'Авторизация';
    this._createForm();
  }

  ngOnInit(): void {}

  private _createForm() {
    this.signUpForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
      name: new FormControl(null, [Validators.required]),
    });
  }

  submit(): void {
    this.isLoading = true;
    this.user$ = this.AuthService.signUp(this.signUpForm.getRawValue())
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          console.log('register');
        },
        error: (err: FirebaseError) => {
          this.error = err.message;
        },
      });
  }

  OnDestroy() {
    this.user$?.unsubscribe();
  }

  get email() {
    return this.signUpForm.get('email');
  }

  get password() {
    return this.signUpForm.get('password');
  }

  get name() {
    return this.signUpForm.get('name');
  }
}
