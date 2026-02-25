import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../pages/employees/models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private http = inject(HttpClient);

  private registerUrl = 'http://localhost:3000/api/employees/register';
  private updateUrl = 'http://localhost:3000/api/employees/edit';
  private employeesUrl = 'http://localhost:3000/api/employees';

  addEmployee(employee: Employee): Observable<any> {
    return this.http.post<any>(this.registerUrl, employee, { withCredentials: true });
  }

  updateEmployee(id: number, data: Partial<Employee>): Observable<any> {
    return this.http.put<any>(
      `${this.updateUrl}/${id}`,
      data,
      { withCredentials: true }
    );
  }


  getEmployeeById(id: number) {
    return this.http.get<Employee>(
      `${this.employeesUrl}/${id}`,
      { withCredentials: true }
    );
  }
  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.employeesUrl, { withCredentials: true });
  }

  updatePermissions(id: number, rol: string) {
  return this.http.patch(
    `${this.employeesUrl}/permissions/${id}`,
    { rol },
    { withCredentials: true }
  );
}

  resetPassword(id: number, new_password: string) {
    return this.http.patch(
      `${this.employeesUrl}/${id}/reset-password`,
      { new_password },
      { withCredentials: true }
    );
  }

}
