import {
  HttpInterceptorFn,
} from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token  = localStorage.getItem('Authorization');
  const modifiedReq = req.clone({headers : req.headers.set('Authorization',`${token}`)})
  return next(modifiedReq);
};
