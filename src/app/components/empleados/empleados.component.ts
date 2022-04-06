import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmpleadosService } from 'src/app/services/empleados.service';


@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.scss']
})
export class EmpleadosComponent implements OnInit {

  empleados: any[] = [];

  agregarForm: FormGroup;
  email: String = "";

  hoy: any;

  @ViewChild('cerrarForm') cerrarForm: any;

  public page!: number;
  pages: number = 1;

  constructor(
    private es: EmpleadosService,
    public formBuilder: FormBuilder,
  ) {

  
    this.agregarForm = formBuilder.group({
      apellido1: [
        '',
        Validators.compose([
          Validators.maxLength(20),
          Validators.pattern('[a-zA-Z ]*'),
          Validators.required,
        ]),
      ],

      apellido2: [
        '',
        Validators.compose([
          Validators.maxLength(20),
          Validators.pattern('[a-zA-Z ]*'),
          Validators.required,
        ]),
      ],

      nombre1: [
        '',
        Validators.compose([
          Validators.maxLength(20),
          Validators.pattern('[a-zA-Z ]*'),
          Validators.required,
        ]),
      ],

      nombre2: [
        '',
        Validators.compose([
          Validators.maxLength(30),
          Validators.pattern('[a-zA-Z ]*'),
        ]),
      ],

      pais: [
        '',
        Validators.compose([
          Validators.pattern('[a-zA-Z ]*'),
          Validators.required,
        ]),
      ],

      identificacion: [
        '',
        Validators.compose([
          Validators.required,
        ]),
      ],

      documento: [
        '',
        Validators.compose([
          Validators.maxLength(20),
          Validators.minLength(6),
          Validators.pattern(/\-?\d*\.?\d{1,2}/),
          Validators.required,
        ]),
      ],

      email: [
        '',
        Validators.compose([
          Validators.maxLength(300),
          Validators.required,
        ]),
      ],
      
      ingreso: [undefined, Validators.required],

      area: [
        '',
        Validators.compose([
          Validators.required,
        ]),
      ],

      estado: [
        '',
        Validators.compose([
          Validators.required,
        ]),
      ],

      registro: [undefined, Validators.required],
      
    });
  }

  ngOnInit(): void {    
    this.obtenerEmpleados();
  }

  obtenerEmpleados() {
    this.es.obtenerEmpleados().subscribe(empleados => {
      this.empleados = empleados;
      console.log(empleados);
    }, error => {
      console.log(error);
    })
  }

  onChange(data: any) {
    // Setear email a formulario
    if (this.agregarForm) {
      if (this.agregarForm.value.nombre1 != '' && this.agregarForm.value.apellido1 != '' && this.agregarForm.value.apellido2 != '') {
        let dominio = '';
        let email = '';
        if (this.agregarForm.value.pais == 'Colombia') {
          dominio = '@cidenet.com.co';
        } else {
          dominio = '@cidenet.com.us';
        }

        if (this.agregarForm.value.nombre2 == '') {
          email = this.agregarForm.value.nombre1 + this.agregarForm.value.apellido1 + this.agregarForm.value.apellido2;
        } else {
          email = this.agregarForm.value.nombre1 + this.agregarForm.value.nombre2 + this.agregarForm.value.apellido1 + this.agregarForm.value.apellido2;
        }

        this.es.verificarEmail(email).subscribe(resp => {
          console.log(resp);
          if (resp != true) {
            console.log('entra');
            var x = Math.floor((Math.random() * (99 - 1 + 1)) + 1);
            this.email = email + x + dominio;
            this.agregarForm.controls.email.setValue(this.email);
          } else{
            console.log('no entra');
            this.email = email + dominio;
            this.agregarForm.controls.email.setValue(this.email);
          }
        })
      }
    }

    // setear fecha
    let date = new Date();
    let day = `0${date.getDate()}`.slice(-2);
    let month = `0${date.getMonth() + 1}`.slice(-2);
    let year = date.getFullYear();

    var fecha = `${year}-${month}-${day}`
        
    var hoy = new Date();
    var hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();

    this.hoy = fecha;
    
    this.agregarForm.controls.registro.setValue(fecha);

  }

  crearEmpleado() {
    let fecha = new DatePipe('en-CO').transform( this.agregarForm.value.ingreso, 'yyyy-MM-dd');

    if(this.agregarForm.value.ingreso <= this.hoy) {
      let nombres = "";
      if (this.agregarForm.value.nombre2 != '') {
        nombres = this.agregarForm.value.nombre1 + ' ' + this.agregarForm.value.nombre2
      } else {
        nombres = this.agregarForm.value.nombre1
      }
      const empleado = {
        apellido1: this.agregarForm.value.apellido1,
        apellido2: this.agregarForm.value.apellido2,
        nombres: nombres,
        pais: this.agregarForm.value.pais,
        identificacion: this.agregarForm.value.identificacion,
        documento: this.agregarForm.value.documento,
        email: this.email,
        ingreso: fecha,
        area: this.agregarForm.value.area,
        estado: this.agregarForm.value.estado,
        registro: this.agregarForm.value.registro
      };
      console.log(empleado);
      
      this.es.crearEmpleado(empleado).subscribe(res => {
        console.log('empleado creado ', res);
        // Cerrar modal
        this.obtenerEmpleados();
        this.cerrarForm.nativeElement.click();
      });
    } else {
      alert('La fecha de ingreso no puede ser superior a la fecha actual')
    }
    
 
  }

  eliminarEmpleado(id: number) {
    if(confirm("Esta de seguro de eliminar el empleado?")) {
      this.es.eliminarEmpleado(id).subscribe(resp => {
        console.log(resp);
        this.obtenerEmpleados();
      });
    }
  }

}
