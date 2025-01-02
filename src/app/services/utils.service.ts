import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, AlertOptions, LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingController = inject(LoadingController)
  toastController = inject(ToastController)
  router = inject(Router)
  modalController = inject(ModalController)
  alertController = inject(AlertController)
  loadingCtrl = inject(LoadingController)
  toastCtrl = inject(ToastController)

  loading(){
    return this.loadingController.create({
      message: 'Loading'
    })
  }

  // ============ Alert ===========
  async presentAlert(opts?: AlertOptions) {
    const alert = await this.alertController.create(opts);
    await alert.present();
  }

  async showToast(op?:ToastOptions){
    const toast = await this.toastController.create(op)
    toast.present()
  }

  routerLink(url:string)
  {
    return this.router.navigateByUrl(url)
  }

  presentLoading() {
    return this.loadingCtrl.create({
      spinner: 'crescent',
    });

  }

  //Toast
  async presentToast(opts:ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    return toast.present();
  }

  //Almacenamiento local
  saveInLocalStorage(key:string, value:any)
  {
    return localStorage.setItem(key, JSON.stringify(value))
  }

  getFromLocalStorage(key:string)
  {
    return JSON.parse(localStorage.getItem(key))
  }

  //Manejo de modales
  async presentModal(opt:ModalOptions)
  {
    const modal = await this.modalController.create(opt)
    await modal.present()

    const { data } = await modal.onWillDismiss()
    if (data) return data;
  }

  dismissModal(data?:any)
  {
    return this.modalController.dismiss(data)
  }

  //Manejo de la cámara
  async takePicture(promptLabelHeader:string)
  {
    return await Camera.getPhoto({
      resultType:CameraResultType.DataUrl,
      quality:90,
      allowEditing:true,
      source:CameraSource.Prompt,
      promptLabelHeader,
      promptLabelPhoto:'Selecciona una imagen',
      promptLabelPicture:'Toma una foto'
    })
  }
}
