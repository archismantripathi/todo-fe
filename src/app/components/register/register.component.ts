import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private _snackBar: MatSnackBar
  ) {}

  signupForm = this.formBuilder.group({
    username: ['', [Validators.required, Validators.nullValidator]],
    fullName: ['', [Validators.required, Validators.nullValidator]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
  });

  get form() {
    return this.signupForm.controls;
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      this.openSnackBar('Invalid Form');
      return;
    }
    if (
      this.signupForm.value.password != this.signupForm.value.confirmPassword
    ) {
      this.openSnackBar("Passwords didn't match");
      return;
    }
    this.userService.register(
      String(this.signupForm.value.username),
      String(this.signupForm.value.fullName),
      String(this.signupForm.value.password)
    ).subscribe();
    return;
  }

  openSnackBar(msg: string): void {
    this._snackBar.open(msg, 'Got it!', {
      horizontalPosition: this.horizontalPosition,
    });
  }
}
