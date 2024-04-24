import {
  HttpInterceptorFn,
} from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('test');
  return next(req);
};
