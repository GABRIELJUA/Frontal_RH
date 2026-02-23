import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { EmployeeService } from '../../services/employee.service';
import { AuthService } from '../../services/auth.service';


export interface Employee {
  id_empleado?: number;
  num_nomina: string;
  password?: string; // Se enviará como 'password' y el back hará el hash
  rol: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  fecha_nacimiento: string;
  sexo: string;
  estado_civil: string;
  rfc: string;
  curp: string;
  nss: string;
  correo: string;
  fecha_ingreso: string;
  puesto: string;
  departamento: string;
}

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  private employeeService = inject(EmployeeService);
  private authService = inject(AuthService);
  private router = inject(Router);

  employees: Employee[] = [];
  loading = true;
  errorMessage: string | null = null;

  // 🔐 Control de edición de permisos
  selectedEmployee: Employee | null = null;
  isEditing = false;

  hasAccess = true;

  ngOnInit(): void {

    this.authService.getMe().subscribe({
      next: (employee: any) => {
        if (employee.rol !== 'ADMIN') {
          this.hasAccess = false;
          return;
        }

        this.loadEmployees();
      },
      error: () => {
        this.router.navigate(['/login']);
      }
    });

  }

  // ================== CARGAR USUARIOS (NO EMPLEADOS) ==================
  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        // 👉 SOLO empleados con acceso al sistema
        this.employees = data.filter(
          (e: Employee) => e.rol !== 'EMPLEADO'
        );

        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Error al cargar usuarios del sistema';
      }
    });
  }

  // ================== EDITAR PERMISOS ==================
  editPermissions(employee: Employee) {
    this.selectedEmployee = { ...employee }; // copia segura
    this.isEditing = true;
  }

  cancelEdit() {
    this.selectedEmployee = null;
    this.isEditing = false;
  }

  savePermissions() {
    if (!this.selectedEmployee?.id_empleado) return;

    this.employeeService.updatePermissions(
      this.selectedEmployee.id_empleado,
      this.selectedEmployee.rol
    ).subscribe({
      next: () => {
        alert('Permisos actualizados correctamente');
        this.cancelEdit();
        this.loadEmployees();
      },
      error: (err) => {
        alert(err.error?.message || 'Error al actualizar permisos');
      }
    });
  }


  goToAdmin() {
  this.router.navigate(['/admin']);
}

}