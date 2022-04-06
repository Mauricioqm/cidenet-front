import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import {NgxPaginationModule} from 'ngx-pagination';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Componentes
import { EmpleadosComponent } from './components/empleados/empleados.component';
import { EmpleadoComponent } from './components/empleado/empleado.component';

import { Routes, RouterModule } from '@angular/router';
import { ModalConfirmacionComponent } from './components/modal-confirmacion/modal-confirmacion.component';
//Ruteo
const AppRoutes: Routes = [
  {path: '', component: EmpleadosComponent},
  {path: 'editar-empleado/:id', component: EmpleadoComponent},
]

@NgModule({
  declarations: [
    AppComponent,
    EmpleadosComponent,
    EmpleadoComponent,
    ModalConfirmacionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot( AppRoutes ),
    FormsModule, 
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
