import { Component, inject } from '@angular/core';
import { LogService } from '../../services/log.service';

@Component({
  selector: 'app-data',
  standalone: true,
  imports: [],
  templateUrl: './data.component.html',
  styleUrl: './data.component.scss'
})
export class DataComponent {
  private logsServ:LogService = inject(LogService);



  updateLogs(){
    this.logsServ.agregarMailsLogs();
  }

  createLogs(dias:number){
    this.logsServ.GenerarLogsPorCantDeDias(dias);
  }
}
