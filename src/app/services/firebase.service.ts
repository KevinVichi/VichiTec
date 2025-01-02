import { Injectable, inject } from '@angular/core';
import { AngularFireAuth }  from '@angular/fire/compat/auth'
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth'
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import {
  getFirestore,
  setDoc,
  doc,
  addDoc,
  getDoc,
  collection,
  collectionData,
  query,
  updateDoc,
  deleteDoc
}  from '@angular/fire/firestore'
import { AngularFireStorage } from '@angular/fire/compat/storage'
import { UtilsService } from './utils.service';

import {
  getStorage,
  uploadString,
  ref,
  getDownloadURL,
  deleteObject,
}  from 'firebase/storage'

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth)
  firestore = inject(AngularFirestore)
  storage = inject(AngularFireStorage)
  utilsSrv = inject(UtilsService)

  //AUTENTICACION
  //acceso

  signIn(user:User)
  {
    return signInWithEmailAndPassword(getAuth(),user.email, user.password)
  }

  //registro
  signUp(user:User)
  {
    return createUserWithEmailAndPassword(getAuth(),user.email, user.password)
  }

  //actualizar perfil de usuario
  updateProfile(displayName:string)
  {
    return updateProfile(getAuth().currentUser,{displayName})
  }

  // reset password
  sendResetEmail(email:string){
    return sendPasswordResetEmail(getAuth(),email)
  }

//Cierre de sesión

getAuth(){
  return getAuth()
}

signOut(){
  getAuth().signOut()
  localStorage.removeItem('user')
  this.utilsSrv.routerLink('/auth')
}

  //BASE DE DATOS
  //setear un documento
  setDocument(path:string,data:any)
  {
    return setDoc(doc(getFirestore(),path),data)
  }

  //Obtener documentos de una colección
  getCollectionData(path:string, collectionQuery?: any)
  {
    const ref = collection(getFirestore(),path)
    return collectionData(query(ref, ...collectionQuery), {idField:'id'})
  }

  //Actualizar un documento
  updateDocument(path:string, data:any)
  {
    return updateDoc(doc(getFirestore(),path),data)
  }

  //Eliminar un documento
  deleteDocument(path:string)
  {
    return deleteDoc(doc(getFirestore(),path))
  }

  //Obtener un documento
  async getDocument(path:string)
  {
    return (await getDoc(doc(getFirestore(),path))).data()
  }

    //Agregar un documento
    addDocument(path:string, data:any)
    {
      return addDoc(collection(getFirestore(),path),data)
    }

  //ALMACENAMIENTO
  //Subir una imagen
  async uploadImage(path:string, data_url:string)
  {
    return uploadString(ref(getStorage(),path),data_url,'data_url').then(
      () => {
        return getDownloadURL(ref(getStorage(),path))
      }
    )
  }

  //Obtener la ruta de la imagen a través de la url
  async getFilePath(url:string)
  {
    return ref(getStorage(),url).fullPath
  }

  //Eliminar el archivo
  deleteFile(path:string)
  {
    return deleteObject(ref(getStorage(),path))
  }

  async documentExists(path: string): Promise<boolean> {
    return this.firestore.doc(path).get().toPromise().then(doc => doc.exists);
  }

  deleteImage(imageUrl: string): Promise<void> {
    const storageRef = this.storage.refFromURL(imageUrl);
    return storageRef.delete().toPromise();
  }


}
