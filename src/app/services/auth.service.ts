import { Observable, of, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private baseUrl: string= "https://localhost:7091/api/User/";
  constructor(private router: Router, private http: HttpClient) {}

  signUp(data:any): Observable<any>{
    return this.http.post<any>('https://localhost:7091/api/User/RegisterUser',data);
  }

  login(loginObj: any){
    return this.http.post<any>(`${this.baseUrl}authenticate`, loginObj);
    // if (abc.length != 0) {
    //   this.authService.setToken('abcdefghijklmnopqrstuvwxyz');

    //   this.route.navigate(['/main']);
    // } else {
    //   alert('Wrong Credentials!');
    // }
  }


  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn() {
    return this.getToken() !== null;
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['login']);
  }

}