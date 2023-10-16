import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  providers: [MessageService]
})
export class SigninComponent {
  email!: string;
  password!: string;
  user!: any;
  constructor(private authService: AuthService, private router: Router, private messageService: MessageService) { }
  submitForm() {
    console.log('Email:', this.email);
    console.log('Password:', this.password);
    this.authService.signin(this.email, this.password)
      .subscribe(
        (response: any) => {
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('user', JSON.stringify(response.user));
          console.log({ response });
          if (response.user.role == "admin") {
            alert('Đăng Nhập Thành Công Admin');
            setTimeout(() => {
              this.router.navigate(['/admin']);
            }, 2000)
          } else {
            alert(`Đăng Nhập Thành Công ${response.user.name}`);
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 2000)
          }
        },
        error => {
          alert(error.error.message);
          console.error("err", error);
        }
      );
  }
}
