import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Docente } from 'src/app/models/docente.model';
import { Ubigeo } from 'src/app/models/ubigeo.model';
import { DocenteService } from 'src/app/services/docente.service';
import { UbigeoService } from 'src/app/services/ubigeo.service';
import Swal from 'sweetalert2'
import { CrudDocenteComponent } from '../crud-docente/crud-docente.component';

@Component({
  selector: 'app-crud-docente-update',
  templateUrl: './crud-docente-update.component.html',
  styleUrls: ['./crud-docente-update.component.css']
})
export class CrudDocenteUpdateComponent {
  departamentos : string[] = [];
  provincias : string[] = [];
  distritos : Ubigeo[] = [];

  docente : Docente = {
    idDocente: 0,
    nombre: "",
    dni: "",
    estado: 1,
    ubigeo: {
      idUbigeo: -1,
      departamento: "-1",
      provincia: "-1",
      distrito: "-1",
    },
  };

  constructor(private ubigeoService: UbigeoService, private docenteService : DocenteService, private formBuilder: FormBuilder, private dialogRef : MatDialogRef<CrudDocenteComponent>, @Inject(MAT_DIALOG_DATA) public data: Docente) {
    this.docente = data;
    this.ubigeoService.listarDepartamento().subscribe(
      response => this.departamentos = response
    );
    this.ubigeoService.listaProvincias(this.docente.ubigeo?.departamento).subscribe(
      response =>  this.provincias= response
    );
    this.ubigeoService.listaDistritos(this.docente.ubigeo?.departamento, this.docente.ubigeo?.provincia).subscribe(
      response =>  this.distritos= response
    ); 
  };

  onNoClick(): void{
    this.dialogRef.close();
  }

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

  actualiza(){
    this.docenteService.actualiza(this.docente).subscribe(
      response => {
        Swal.fire("Mensaje", response.mensaje, "info");
      }
    );
  }
}
