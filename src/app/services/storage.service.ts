import { Injectable, inject } from '@angular/core';
import { Storage, getDownloadURL, ref, uploadBytesResumable, uploadString } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storage:Storage = inject(Storage)
  private dirUsers:string = 'users/'

  constructor() { }

  getFormattedDate(): string {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript son de 0 a 11
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  }

  async guardarFotoUsuario(name:string, foto:any){
    const filepath = this.dirUsers + name + '_' + this.getFormattedDate();
    const fileref = ref(this.storage, filepath);

    let url:string = '';

    await uploadBytesResumable(fileref, foto).then(async () => {
      url = await getDownloadURL(fileref);
    });

    return url
  }


}
