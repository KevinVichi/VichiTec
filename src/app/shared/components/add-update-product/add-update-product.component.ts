import { Component, Input, OnInit, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
})
export class AddUpdateProductComponent  implements OnInit {
  @Input() product:Product

  utilsSrv = inject(UtilsService)
  firebaseSvc = inject(FirebaseService);

  form = new FormGroup({
    id: new FormControl(''),
    image: new FormControl('',[Validators.required]),
    name: new FormControl('',[Validators.required, Validators.minLength(4)]),
    price: new FormControl(null,[Validators.required, Validators.min(0)]),
    soldUnits: new FormControl(null,[Validators.required, Validators.min(0)]),
  })

  user = {} as User;

  constructor() { }

  ngOnInit() {
    this.user = this.utilsSrv.getFromLocalStorage('user');
    if (this.product) this.form.setValue(this.product);
  }

  async takeImage()
  {
    const dataUrl = ( await this.utilsSrv.takePicture('Imagen del producto')).dataUrl
    this.form.controls.image.setValue(dataUrl)
  }

  submit()
  {
    if (this.form.valid) {

      if(this.product) this.updateProduct();
      else this.createProduct()

    }
  }

  // ======== Crear Producto =======
  async createProduct() {
    let path = `users/${this.user.uid}/products`

    const loading = await this.utilsSrv.loading();
    await loading.present();

    // === Subir la imagen y obtener la url ===
    let dataUrl = this.form.value.image;
    let imagePath = `${this.user.uid}/${Date.now()}`;
    let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
    this.form.controls.image.setValue(imageUrl);

    delete this.form.value.id

    this.firebaseSvc.addDocument(path, this.form.value).then(async res => {

      this.utilsSrv.dismissModal({ success: true });

      this.utilsSrv.showToast({
        message: 'Producto creado exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      })

    }).catch(error => {
      console.log(error);

      this.utilsSrv.showToast({
        message: error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      })

    }).finally(() => {
      loading.dismiss();
    })
}
private async updateProduct() {
  let path = `users/${this.user.uid}/products/${this.product.id}`;

  const loading = await this.utilsSrv.loading();
  await loading.present();

  try {
    // === Verificar si la imagen ha cambiado y subir la nueva imagen ===
    if (this.form.value.image !== this.product.image) {
      // Eliminar la imagen anterior
      await this.firebaseSvc.deleteImage(this.product.image);

      // Subir la nueva imagen
      let dataUrl = this.form.value.image;
      let imagePath = `${this.user.uid}/${Date.now()}`;
      let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
      this.form.controls.image.setValue(imageUrl);
    }

    // Actualizar el documento con los nuevos datos
    await this.firebaseSvc.updateDocument(path, this.form.value);

    this.utilsSrv.dismissModal({ success: true });

    this.utilsSrv.showToast({
      message: 'Producto actualizado exitosamente',
      duration: 1500,
      color: 'success',
      position: 'middle',
      icon: 'checkmark-circle-outline',
    });

  } catch (error) {
    console.log(error);

    this.utilsSrv.showToast({
      message: error.message,
      duration: 2500,
      color: 'primary',
      position: 'middle',
      icon: 'alert-circle-outline',
    });
  } finally {
    loading.dismiss();
  }
}
}
