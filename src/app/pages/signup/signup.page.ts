import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  ionicForm!: FormGroup;

  constructor(
    private toastController: ToastController,
    private loadingController: LoadingController,
    private authService:AuthenticationService,
    private router: Router,
    public formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.initializeForm();
  }

  public initializeForm() {
    const NAMEPATTERN: RegExp = /^[a-zA-Z ]+$/;
    const EMAILPATTERN: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const PASSWORDPATTERN: RegExp = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-8])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}/;

    this.ionicForm = this.formBuilder.group({
      name:['',
        [Validators.required, Validators.pattern(NAMEPATTERN)]
      ],
      email: [
        '',
        [Validators.required, Validators.pattern(EMAILPATTERN)],
      ],
      password: ['',
        [Validators.required, Validators.pattern(PASSWORDPATTERN)],
      ],
    });
  }

  public async signUP(){
    const loading = await this.loadingController.create();
    await loading.present();
    if (this.ionicForm?.valid) {

      const user = await this.authService.registerUser(this.ionicForm.value.email, this.ionicForm.value.password).catch((err) => {
        this.presentToast('The credentials are not valid!')
        loading.dismiss();
      })

      if (user) {
        loading.dismiss();
        this.router.navigate(['/home'])
      }
    } else {
      this.presentToast('Please provide all the required values!');
    }
  }

  public async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'top',
    });

    await toast.present();
  }

  get errorControl() {
    return this.ionicForm.controls;
  }
}
