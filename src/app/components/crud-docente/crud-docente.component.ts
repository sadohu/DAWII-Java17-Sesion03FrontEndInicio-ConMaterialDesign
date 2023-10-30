import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Docente } from 'src/app/models/docente.model';
import { Ubigeo } from 'src/app/models/ubigeo.model';
import { DocenteService } from 'src/app/services/docente.service';
import { UbigeoService } from 'src/app/services/ubigeo.service';
import Swal from 'sweetalert2'
import { CrudDocenteAddComponent } from '../crud-docente-add/crud-docente-add.component';
import { CrudDocenteUpdateComponent } from '../crud-docente-update/crud-docente-update.component';

@Component({
  selector: 'app-crud-docente',
  templateUrl: './crud-docente.component.html',
  styleUrls: ['./crud-docente.component.css']
})
export class CrudDocenteComponent implements OnInit {

  //Para la Grilla
   filtro: string ="";
 
   //Para el ubigeo
   departamentos: string[] = [];;
   provincias: string[] = [];;
   distritos: Ubigeo[] = [];;

   
   //Grila
  dataSource:any;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  displayedColumns = ["idDocente","nombre","dni","fecha","hora","ubigeo","estado",'actions'];

  constructor(private formBuilder: FormBuilder,  
              private dialogService: MatDialog,
              private docenteService:DocenteService, 
              private ubigeoService:UbigeoService) {
      this.ubigeoService.listarDepartamento().subscribe(
          response => this.departamentos = response
      );            
  }

  
  openAddDialog() {
    console.log(">>> openAddDialog  >>");
    const dialogRef = this.dialogService.open(CrudDocenteAddComponent);
    dialogRef.afterClosed().subscribe(result => {
        console.log(">>> result >> " + result);
        if (result === 1) {
            this.refreshTable();
        }
    });
  }

  ngOnInit(): void {}

  consultaDocente(){
      console.log(">>> consultaDocente >>> " +  this.filtro);
      this.refreshTable();
  }

  private refreshTable() {
    this.docenteService.consultaPorNombre(this.filtro == "" ? "todos" : this.filtro).subscribe(
      x => {
        this.dataSource = new MatTableDataSource<Docente>(x);
        this.dataSource.paginator = this.paginator; 
      }
    );
  }

  actualizaEstado(obj : Docente){

  }

  openUpdateDialog(obj : Docente){
    const dialogRef = this.dialogService.open(CrudDocenteUpdateComponent, {data:obj});

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.refreshTable();
      }
    });
  }

  elimina(obj : Docente){

  }
}