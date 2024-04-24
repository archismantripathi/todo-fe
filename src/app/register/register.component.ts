import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { MatSnackBar, MatSnackBarHorizontalPosition } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { uri } from '../config/uri.config';

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
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  constructor(private formBuilder: FormBuilder, private authService: AuthService, private _snackBar: MatSnackBar, private http: HttpClient, private router: Router){}

  signupForm = this.formBuilder.group({
    username: ['', [
      Validators.required,
      Validators.nullValidator
    ]],
    fullName: ['', [
      Validators.required,
      Validators.nullValidator
    ]],
    password: ['',[
      Validators.required,
      Validators.minLength(8)
    ]],
    confirmPassword: ['',[
      Validators.required,
      Validators.minLength(8)
    ]],
  });

  get form() { return this.signupForm.controls; };

  onSubmit() {
    if(this.signupForm.invalid) {
      this.openSnackBar("Invalid Form");
      return;
    }
    if(this.signupForm.value.password != this.signupForm.value.confirmPassword){
      this.openSnackBar("Passwords didn't match");
      return;
    }
    if(this.register(String(this.signupForm.value.username), String(this.signupForm.value.fullName), String(this.signupForm.value.password)))
      this.openSnackBar("Registration Successful");
    return;
  }

  register(username: string, fullName: string, password: string): boolean {
    let noErr: boolean = false;
    this.http
      .post<string>(uri + 'api/user', {
        username: username,
        fullName: fullName,
        password: password
      })
      .subscribe((data) => {
        if (data != null) {
          localStorage.setItem('Authorization', data);
          this.router.navigate(['/todo']);
          noErr=true;
        }
      });
      return noErr;
  }

  openSnackBar(msg: string): void {
    this._snackBar.open(msg, 'Got it!', {
      horizontalPosition: this.horizontalPosition
  });}
}
