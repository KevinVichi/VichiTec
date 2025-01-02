import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'firebase/auth';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage {

  firebaseSvc = inject(FirebaseService)
  utilsSvc = inject(UtilsService)


  group = new FormGroup({
    email: new FormControl('',[Validators.required, Validators.email]),
  })

  async submit(){
    if(this.group.valid)
    {
      const loading = await this.utilsSvc.presentLoading()
      loading.present()
      this.firebaseSvc.sendResetEmail(this.group.value.email)
      .then(()=> {
        this.utilsSvc.routerLink('/auth')
      })
        .catch(err => {
          this.utilsSvc.presentToast({
            message:err.message,
            color:'danger',
            position:'top',
            duration:2000,
            icon:'alert-circle-outline'
          })
        })
        .finally(()=>{
          loading.dismiss()
        })
    }
  }

}
