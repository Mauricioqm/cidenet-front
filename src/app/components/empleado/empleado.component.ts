import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { empleado } from 'src/app/modelos/empleado';
import { EmpleadosService } from 'src/app/services/empleados.service';

@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.scss']
})
export class EmpleadoComponent implements OnInit {

  empleadoForm: FormGroup;
  titulo = 'Editar empleado';
  id: any;

  email: String = "";

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private empleadoService: EmpleadosService,
    private aRouter: ActivatedRoute
  ) {
    this.empleadoForm = this.fb.group({
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

      nombres: [
        '',
        Validators.compose([
          Validators.maxLength(20),
          Validators.pattern('[a-zA-Z ]*'),
          Validators.required,
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
          // Validators.pattern(/\-?\d*\.?\d{1,2}/),
          Validators.pattern(/^[^$a%&|<>#]*$/),
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

      // registro: [undefined, Validators.required],
    })

    this.id = this.aRouter.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.editar();
  }

  editar(){
    if (this.id !== null) {
      this.titulo = 'Editar empleado';
      this.empleadoService.obtenerEmpleado(this.id).subscribe(data => {
        console.log(data);
        
        this.empleadoForm.setValue({
          apellido1: data.apellido1,
          apellido2: data.apellido2,
          nombres: data.nombres,
          identificacion: data.identificacion,
          documento: data.documento,
          pais: data.pais,
          email: data.email,
          area: data.area,
          ingreso: data.ingreso,
          estado: data.estado,
        })
      })
    }
  
  }

  onChange(data: any) {
    // Setear email a formulario
    if (this.empleadoForm) {
      if (this.empleadoForm.value.nombre1 != '' && this.empleadoForm.value.apellido1 != '' && this.empleadoForm.value.apellido2 != '') {
        let dominio = '';
        let email = '';
        if (this.empleadoForm.value.pais == 'Colombia') {
          dominio = '@cidenet.com.co';
        } else {
          dominio = '@cidenet.com.us';
        }

        if (this.empleadoForm.value.nombre2 == '') {
          email = this.empleadoForm.value.nombre1 + this.empleadoForm.value.apellido1 + this.empleadoForm.value.apellido2;
        } else {
          email = this.empleadoForm.value.nombre1 + this.empleadoForm.value.nombre2 + this.empleadoForm.value.apellido1 + this.empleadoForm.value.apellido2;
        }

        this.empleadoService.verificarEmail(email).subscribe(resp => {
          console.log(resp);
          if (resp == true) {
            this.email = email + dominio;
            this.empleadoForm.controls.email.setValue(this.email);
          } else {
            var x = Math.floor((Math.random() * (99 - 1 + 1)) + 1);
            this.email = email + x + dominio;
            this.empleadoForm.controls.email.setValue(this.email);
          }
        })
      }
    }

  }

  actualizarEmpleado() {
    const Empleado: empleado = {
      apellido1: this.empleadoForm.get('apellido1')?.value,
      apellido2: this.empleadoForm.get('apellido2')?.value,
      nombres: this.empleadoForm.get('nombres')?.value,
      pais: this.empleadoForm.get('pais')?.value,
      identificacion: this.empleadoForm.get('identificacion')?.value,
      documento: this.empleadoForm.get('documento')?.value,
      email: this.empleadoForm.get('email')?.value,
      ingreso: this.empleadoForm.get('ingreso')?.value,
      area: this.empleadoForm.get('area')?.value,
      estado: this.empleadoForm.get('estado')?.value,
      registro: this.empleadoForm.get('registro')?.value,
    }

    this.empleadoService.actualizarEmpleado(this.id, Empleado).subscribe(data => {
      // this.toastr.success('El empleado fue actualizado con exito!');
      this.router.navigate(['/']);
      
    }, error => {
      console.log(error);
      this.empleadoForm.reset();
    })
  }

}
