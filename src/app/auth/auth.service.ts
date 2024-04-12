import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  uri = 'http://127.0.0.1:8080/';
  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string) {
    this.http
      .post<string>(this.uri + 'api/user/login', {
        username: username,
        password: password,
      })
      .subscribe((data) => {
        if(data!=null) {
          localStorage.setItem("Authorization", data);
          this.router.navigate(['/todo']);
        }
      });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  isAuth() {
    if(localStorage.getItem("Authorization")) {
      return true;
    } else {
      return false;
    }
  }
}
