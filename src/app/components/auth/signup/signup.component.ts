import { Component, OnInit } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  userSub$!: Subscription;

  constructor(private AuthService: AuthService, private router: Router) {
    document.title = 'Регистрация';
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
    this.userSub$ = this.AuthService.signUp(this.signUpForm.getRawValue())
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          this.router.navigate(['/restaurants']);
        },
        error: (err: FirebaseError) => {
          this.error = err.message;
        },
      });
  }

  OnDestroy() {
    this.userSub$?.unsubscribe();
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
