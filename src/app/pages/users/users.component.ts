import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { EmployeeService } from '../../services/employee.service';
import { AuthService } from '../../services/auth.service';


type ToastType = 'success' | 'error' | 'info';

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

  toast = {
    show: false,
    message: '',
    type: 'info' as ToastType
  };

  // 🔐 Control de edición de permisos
  selectedEmployee: Employee | null = null;
  isEditing = false;

  // 🔐 Control de reseteo de contraseña
  selectedEmployeeForPassword: Employee | null = null;
  isResettingPassword = false;
  resetPasswordData = {
    newPassword: '',
    confirmPassword: ''
  };

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
        this.toastMsg('Permisos actualizados correctamente', 'success');
        this.cancelEdit();
        this.loadEmployees();
      },
      error: (err) => {
        this.toastMsg(err.error?.message || 'Error al actualizar permisos', 'error');
      }
    });
  }

  // ================== RESETEAR CONTRASEÑA (SOLO ADMIN) ==================
  openResetPassword(employee: Employee) {
    this.selectedEmployeeForPassword = { ...employee };
    this.isResettingPassword = true;
    this.resetPasswordData = {
      newPassword: '',
      confirmPassword: ''
    };
  }

  cancelResetPassword() {
    this.selectedEmployeeForPassword = null;
    this.isResettingPassword = false;
    this.resetPasswordData = {
      newPassword: '',
      confirmPassword: ''
    };
  }

  saveResetPassword() {
    if (!this.selectedEmployeeForPassword?.id_empleado) {
      return;
    }

    const { newPassword, confirmPassword } = this.resetPasswordData;

    if (!newPassword || !confirmPassword) {
      this.toastMsg('Debes capturar y confirmar la nueva contraseña', 'error');
      return;
    }

    if (newPassword.length < 4) {
      this.toastMsg('La nueva contraseña debe tener al menos 4 caracteres', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      this.toastMsg('Las contraseñas no coinciden', 'error');
      return;
    }

    this.employeeService.resetPassword(
      this.selectedEmployeeForPassword.id_empleado,
      newPassword
    ).subscribe({
      next: () => {
        this.toastMsg('Contraseña actualizada correctamente por administrador', 'success');
        this.cancelResetPassword();
      },
      error: (err) => {
        this.toastMsg(err.error?.message || 'Error al resetear contraseña', 'error');
      }
    });
  }

  toastMsg(message: string, type: ToastType = 'info') {
    this.toast.message = message;
    this.toast.type = type;
    this.toast.show = true;

    setTimeout(() => {
      this.toast.show = false;
    }, 3000);
  }


  goToAdmin() {
    this.router.navigate(['/admin']);
  }

}
