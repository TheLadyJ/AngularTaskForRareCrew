export class EmployeeDTO {
    EmployeeName: string;
    TotalWorkingHours: number;

    constructor(EmployeeName: string, TotalWorkingHours: number){
        this.EmployeeName = EmployeeName;
        this.TotalWorkingHours = TotalWorkingHours;
    }
}