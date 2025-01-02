import { Component, OnInit, inject } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateProductComponent } from 'src/app/shared/components/add-update-product/add-update-product.component';
import { orderBy } from 'firebase/firestore';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {

  utilsSrv = inject(UtilsService)
  firebaseSrv = inject(FirebaseService)
  alertCtrl = inject(AlertController);

  products: Product[] = []
  loading:boolean = false

  user(): User {
    return this.utilsSrv.getFromLocalStorage('user');
  }

  ionViewWillEnter() {
    this.getProducts()
  }

  doRefresh(event)
  {
    setTimeout(() => {
      this.getProducts();
      event.target.complete();
    }, 1000);
  }

  // ====== Obtener ganancias =====
  getProfits() {
    return this.products.reduce((index, product) => index + product.price * product.soldUnits, 0);
  }

  // ====== Obtener productos =====
  getProducts() {
    let path = `users/${this.user().uid}/products`;
    console.log(path);
    this.loading = true;

    let query = [
      orderBy('soldUnits', 'desc'),
    ]

    let sub = this.firebaseSrv.getCollectionData(path,query).subscribe({
      next: (res: any) => {
        console.log(res);
        this.products = res;
        this.loading = false;
        sub.unsubscribe();
      }
    })
  }

  async addUpdateProduct(product?:Product)
  {
    let success = await this.utilsSrv.presentModal({
      component:AddUpdateProductComponent,
      cssClass: 'add-update-modal',
      componentProps: { product }
    })
    if (success) this.getProducts();
  }
  async confirmDeleteProduct(product: Product) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que deseas eliminar el producto "${product.name}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.deleteProduct(product);
          },
        },
      ],
    });

    await alert.present();
  }
  async deleteProduct(product: Product) {
    const path = `users/${this.user().uid}/products/${product.id}`;
    const exists = await this.firebaseSrv.documentExists(path);

    if (exists) {
      const imageUrl = product.image;

      // Eliminar el documento de Firestore
      this.firebaseSrv.deleteDocument(path).then(async () => {
        // Eliminar la imagen del Storage
        await this.firebaseSrv.deleteImage(imageUrl);

        // Notificar al usuario
        this.utilsSrv.showToast({
          message: 'Producto eliminado con éxito',
          duration: 2000,
          position: 'top',
        });

        // Recargar la lista de productos
        this.getProducts();
      }).catch(error => {
        this.utilsSrv.showToast({
          message: 'Error al eliminar el producto',
          duration: 2000,
          position: 'top',
        });
        console.error(error);
      });
    } else {
      this.utilsSrv.showToast({
        message: 'El producto no existe',
        duration: 2000,
        position: 'top',
      });
    }
  }
}
