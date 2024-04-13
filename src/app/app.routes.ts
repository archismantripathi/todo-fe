import { Router, Routes } from '@angular/router';
import { TodoComponent } from './todo/todo.component';
import { LoginComponent } from './login/login.component';
import { Page404Component } from './page404/page404.component';
import { RegisterComponent } from './register/register.component';
import { CanActivate } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';
import { inject } from '@angular/core';

export const routes: Routes = [
  { path: 'todo', component: TodoComponent, data: { title: 'To-Do' }, canActivate: [() => {
    const router = inject(Router);

    if(true) {
      return true;
    } else {
      router.navigate(['/login']);
      return false;
    }
  }] },
  { path: 'login', component: LoginComponent, data: { title: 'To-Do Login' } },
  { path: 'register', component: RegisterComponent, data: { title: 'To-Do User Sign-up' } },
  { path: '', redirectTo: "todo", pathMatch: 'full'},
  { path: '**', component: Page404Component, data: { title: '404 Not Found' } },
];
