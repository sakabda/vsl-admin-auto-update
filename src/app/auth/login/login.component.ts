import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthService } from 'src/app/core/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: any;
  isLoading = false;
  errorMessage = false;
  constructor(
    private fb: FormBuilder,
    private notificationService: NzNotificationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      //userName: [null, [Validators.required, Validators.pattern('admin')]],
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  submitLoginForm(): void {
    const userName = this.loginForm.value.userName;
    const password = this.loginForm.value.password;
    if (!this.loginForm.valid) {
      this.markFormGroupTouched(this.loginForm);
      this.errorMessage = false;
    }
    // else if (
    //   (userName != 'admin' && password != '123456') ||
    //   (userName != 'user' && password != '123456')
    // ) {
    //   this.errorMessage = true;
    // }
    else {
      this.errorMessage = false;
      console.log(this.loginForm.value);
      this.isLoading = true;
      this.authService
        .login(this.loginForm.value.userName, this.loginForm.value.password)
        .then((success) => {
          this.notificationService.success('', 'Logged In Successfully ');
          this.isLoading = false;
          this.router.navigateByUrl('/main/dashboard');
        })
        .catch((error) => {
          this.notificationService.error('Error', error.error.message);
          this.isLoading = false;
        });
    }
  }
  private markFormGroupTouched(formGroup: FormGroup): void {
    for (const i in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(i)) {
        formGroup.controls[i].markAsDirty();
        formGroup.controls[i].updateValueAndValidity();
      }
    }
  }
}
