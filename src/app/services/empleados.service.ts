import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { empleado } from '../modelos/empleado';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {
  baseURL: string = 'http://localhost:3000/api/';

  constructor(private httpClient: HttpClient) { }

  obtenerEmpleados(): Observable<any> {
    return this.httpClient.get(this.baseURL);
  }

  obtenerEmpleado(id: number): Observable<any> {
    return this.httpClient.get(this.baseURL + 'empleados/' + id);
  }

  eliminarEmpleado(id: number): Observable<any> {
    return this.httpClient.delete(this.baseURL + 'empleados/' + id);
  }

  verificarEmail(email: string): Observable<any> {
    return this.httpClient.get(this.baseURL + 'empleadosemail/' + email);
  }

  crearEmpleado(empleado: any): Observable<any> {
    return this.httpClient.post(this.baseURL + 'empleados/', empleado);
  }

  actualizarEmpleado(id: number, empleado: empleado): Observable<any> {
    return this.httpClient.put(this.baseURL + 'empleados/' + id, empleado);
  }
}
