import { Routes } from '@angular/router';
import { TodoComponent } from './todo/todo.component';
import { LoginComponent } from './login/login.component';
import { Page404Component } from './page404/page404.component';
import { RegisterComponent } from './register/register.component';
import { todoGuard } from './auth/todo.guard';
import { loginSignupGuard } from './auth/login-signup.guard';

export const routes: Routes = [
  { path: 'todo', component: TodoComponent, data: { title: 'To-Do | Manage your to-do' }, canActivate: [todoGuard] },
  { path: 'login', component: LoginComponent, data: { title: 'To-Do | Login' }, canActivate: [loginSignupGuard] },
  { path: 'register', component: RegisterComponent, data: { title: 'To-Do | Register new user' }, canActivate: [loginSignupGuard] },
  { path: '', redirectTo: "todo", pathMatch: 'full'},
  { path: '**', component: Page404Component, data: { title: '404 Not Found' } },
];
