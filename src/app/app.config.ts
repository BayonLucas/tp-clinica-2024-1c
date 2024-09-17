import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

import { firebaseConfig } from '../../environment';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr';
import { provideNativeDateAdapter } from '@angular/material/core';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideToastr({preventDuplicates: true, positionClass: 'toast-bottom-center'}), 
    provideFirebaseApp(() => initializeApp(firebaseConfig)), 
    provideAuth(() => getAuth()), 
    provideFirestore(() => getFirestore()), 
    provideStorage(() => getStorage()),
    provideHttpClient(), 
    provideAnimationsAsync(),
    provideNativeDateAdapter(),
  ]
};
