import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage {

  public ionicForm!: FormGroup;

  constructor(
    private auth:AuthenticationService,
    private toastController: ToastController,
    private router: Router,
    public formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.initializeForm();
  }

  public initializeForm() {
    const EMAILPATTERN: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    this.ionicForm = this.formBuilder.group({
      email: [
        '',
        [Validators.required, Validators.pattern(EMAILPATTERN)],
      ]
    });
  }

  get errorControl() {
    return this.ionicForm.controls;
  }

  reset(){
    this.auth.resetPassword(this.ionicForm.value.email).then( () =>{
      this.presentToast()
    })
  }
  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Your reset password link has been sent on your email',
      duration: 2000,
      position: 'bottom'
    });

    toast.present();
    toast.onDidDismiss().then(()=>{
      this.router.navigate(['/login']);
    })
  }
}
