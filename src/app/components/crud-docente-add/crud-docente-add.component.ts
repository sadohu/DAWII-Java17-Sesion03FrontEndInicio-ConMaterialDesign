import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Docente } from 'src/app/models/docente.model';
import { Ubigeo } from 'src/app/models/ubigeo.model';
import { DocenteService } from 'src/app/services/docente.service';
import { UbigeoService } from 'src/app/services/ubigeo.service';
import Swal from 'sweetalert2'
import { CrudDocenteComponent } from '../crud-docente/crud-docente.component';

@Component({
  selector: 'app-crud-docente-add',
  templateUrl: './crud-docente-add.component.html',
  styleUrls: ['./crud-docente-add.component.css']
})
export class CrudDocenteAddComponent {
  departamentos : string[] = [];
  provincias : string[] = [];
  distritos : Ubigeo[] = [];

  docente : Docente = {
    idDocente :0,
    nombre : "",
    dni : "",
    estado : 1,
    ubigeo : {
      idUbigeo : -1,
      departamento: "-1",
      provincia: "-1",
      distrito: "-1",
    },
  };

  constructor(
      private ubigeoService: UbigeoService,
      private docenteService : DocenteService,
      private formBuilder: FormBuilder,
      private dialogRef : MatDialogRef<CrudDocenteComponent>){
    this.ubigeoService.listarDepartamento().subscribe(
      response => this.departamentos = response
    );
  };

  cargaProvincia(){
    this.ubigeoService.listaProvincias(this.docente.ubigeo?.departamento).subscribe(
      response => this.provincias = response
    );
    this.distritos = [];
    this.docente.ubigeo!.idUbigeo = -1;
    this.docente.ubigeo!.provincia = "-1";
  }

  cargaDistrito(){
    this.ubigeoService.listaDistritos(this.docente.ubigeo?.departamento, this.docente.ubigeo?.provincia).subscribe(
      response =>  this.distritos = response
    );
    this.docente.ubigeo!.idUbigeo = -1;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  registra(){
    this.docenteService.inserta(this.docente).subscribe(
      x => {
        // una vez que inserto, muestro el mensaje
        Swal.fire('Mensaje', x.mensaje, 'info');
        // luego borramos todo el  json, es decir, inicializamos las variables
        this.docente = {
          idDocente: 0,
          nombre: "",
          dni: "",
          estado: 1,
          ubigeo: {
            idUbigeo: -1,
            departamento: "-1",
            provincia: "-1",
            distrito: "-1",
          }
        };
      }
    );
  }

}
