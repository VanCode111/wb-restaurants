import { Subscription } from 'rxjs';
import { User } from '@angular/fire/auth';
import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  userName: string | null | undefined;
  user: User | null;

  userSub$: Subscription;

  constructor(private authService: AuthService) {
    document.title = 'Профиль';
  }

  ngOnInit(): void {
    this.userSub$ = this.authService.currentUser$.subscribe((user) => {
      this.userName = user?.displayName;
      this.user = user;
    });
  }

  ngOnDestroy(): void {
    this.userSub$.unsubscribe();
  }
}
