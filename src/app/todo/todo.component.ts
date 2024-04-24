import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../auth/auth.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatListModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    TextFieldModule,
    MatMenuModule,
    RouterLink,
  ],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
})
export class TodoComponent implements OnInit, OnDestroy {
  dateText = signal('--');
  nameText = signal('--');
  intervalId: any = 0;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';

  constructor(
    private authService: AuthService,
    private _snackBar: MatSnackBar
  ) {}

  async updateDate() {
    let currentDate = new Date();

    this.dateText.set(
      currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      })
    );
  }

  logout(): void {
    this.authService.logout();
    this.openSnackBar('Logout Successful!');
  }

  ngOnInit(): void {
    const fullName = localStorage.getItem('fullName');
    if (fullName) this.nameText.set(fullName);
    this.updateDate();
    this.intervalId = setInterval(() => {
      this.updateDate();
    }, 900000);
  }

  ngOnDestroy(): void {
    clearTimeout(this.intervalId);
  }

  openSnackBar(msg: string): void {
    this._snackBar.open(msg, 'Got it!', {
      horizontalPosition: this.horizontalPosition,
    });
  }
}
