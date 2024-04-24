import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private _snackBar: MatSnackBar
  ) {}

  loginForm = this.formBuilder.group({
    username: ['', [Validators.required, Validators.nullValidator]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  get form() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.openSnackBar('Invalid Form');
      return;
    }
    this.authService.login(
      String(this.loginForm.value.username),
      String(this.loginForm.value.password)
    ).subscribe();
    return;
  }

  openSnackBar(msg: string): void {
    this._snackBar.open(msg, 'Got it!', {
      horizontalPosition: this.horizontalPosition,
    });
  }
}
