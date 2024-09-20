import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Log } from '../../../models/log';
import { LogService } from '../../../services/log.service';
import { firstValueFrom } from 'rxjs';
import { TimestampToDatePipe } from "../../../pipes/timestamp-to-date.pipe";
import * as XLSX from 'xlsx'
import { format } from 'date-fns';

@Component({
  selector: 'tabla-logs',
  standalone: true,
  imports: [
    MatTableModule, MatPaginatorModule, ReactiveFormsModule, CommonModule, FormsModule, TimestampToDatePipe
],
  templateUrl: './tabla-logs.component.html',
  styleUrl: './tabla-logs.component.scss'
})
export class TablaLogsComponent implements OnInit{
  private logServ:LogService = inject(LogService);

  displayedColumns: string[] = ['uid_usuario', 'email', 'fecha'];
  dataSource!:MatTableDataSource<Log>;
  logs:Log[] = [];
  titulo:string = 'Logs';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  constructor(){
  }

  exportarLogsExcel(){
    const aux = this.logs.map( (item:any) => {
      let fecha = new Date(item.fecha.seconds * 1000 + item.fecha.nanoseconds / 1000000);
      let fechaCompleta = format(fecha, 'dd/MM/yyyy HH:mm:ss');
      return {
        usuario: item.uid_usuario,
        fecha: fechaCompleta,
        email: item.email
      }
    });

    const ws = XLSX.utils.json_to_sheet(aux);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Logs');
    XLSX.writeFile(wb, 'logs.xlsx');
  }

  async ngOnInit(){
    await firstValueFrom(this.logServ.getLogs()).then( data => {
      this.logs = data;
    });
    this.dataSource = new MatTableDataSource<Log>(this.logs);
    this.dataSource.paginator = this.paginator;
  }
}
