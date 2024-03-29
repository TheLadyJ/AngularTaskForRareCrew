import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmployeesService } from './employees/employees.service';
import { EmployeeDTO } from './employees/employeeDTO';
import { IEmployee } from './employees/employee.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'Angular Task For Rare Crew';

  employees: EmployeeDTO[] = [];

  constructor(private employeesService: EmployeesService) { }

  ngOnInit(): void {
    this.employeesService.getEmployees().subscribe(data => {
      this.employees = this.getUniqueEmployeesWithTotalWorkingHours(data);
    });
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
}
