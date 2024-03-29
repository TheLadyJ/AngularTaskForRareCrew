import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmployeesService } from './employees/employees.service';
import { EmployeeDTO } from './employees/employeeDTO';
import { IEmployee } from './employees/employee.interface';
import { CommonModule } from '@angular/common';
import { ChartComponent } from '../chart/chart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ChartComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'Angular Task For Rare Crew';

  employees: EmployeeDTO[] = [];
  pieConfig = {};

  constructor(private employeesService: EmployeesService) { }

  ngOnInit(): void {
    this.employeesService.getEmployees().subscribe(data => {
      this.employees = this.getUniqueEmployeesWithTotalWorkingHours(data);
    });
    this.generatePieChartConfig();
  }

  calculateTotalWorkingHours(start: string, end: string): number {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const differenceMs = endTime - startTime;
    return Math.round(differenceMs / (1000 * 60 * 60));
  }


  getUniqueEmployeesWithTotalWorkingHours(data: IEmployee[]){
    const uniqueEmployeesMap: Map<string, EmployeeDTO> = new Map();

    for(const entry of data){
      const { EmployeeName, StarTimeUtc, EndTimeUtc } = entry;
      if(EmployeeName!==null){
        const totalHours = this.calculateTotalWorkingHours(StarTimeUtc, EndTimeUtc);
        if (!uniqueEmployeesMap.has(EmployeeName)) {
          uniqueEmployeesMap.set(EmployeeName, { EmployeeName, TotalWorkingHours: totalHours });
        } else {
          const existingEmployee = uniqueEmployeesMap.get(EmployeeName)!;
          const existingTotalHours = existingEmployee.TotalWorkingHours || 0;
          uniqueEmployeesMap.set(EmployeeName, {
              EmployeeName,
              TotalWorkingHours: existingTotalHours + totalHours
          });
        }
      }     
    
    }

    return Array.from(uniqueEmployeesMap.values());
  }

  generatePieChartConfig(): void {
    const employeesNames = this.employees.map(employee => employee.EmployeeName);
    const employeesTotalWorkingHours = this.employees.map(employee => employee.TotalWorkingHours);
    const data = {
      labels: employeesNames,
      datasets: [{
        data: employeesTotalWorkingHours,
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
          'rgba(144, 238, 144, 0.5)',
          'rgba(128, 0, 128, 0.5)',
          'rgba(0, 0, 139, 0.5)',
          'rgba(220, 20, 60, 0.5)'
        ]
      }]
    }
    const options = {
      plugins: {
          labels:{
              render: 'percentage',
              fontSize: 12,
              fontColor: '#fff',
              textShadow: true,
          }
      }
  };

    this.pieConfig = {
      type: 'pie',
      data: data,
      options: options   
    };
  }
}
