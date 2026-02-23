import { Component, inject, OnInit } from '@angular/core'; // 1. Importar OnInit
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // 2. Importar ActivatedRoute
import { RouterModule } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';
import { AuthService } from '../../../services/auth.service';
import { Employee } from '../models/employee.model';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-employee-form',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css'
})
export class EmployeeFormComponent implements OnInit {

  private employeeService = inject(EmployeeService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);


  departamentos: string[] = [
    'Almacén',
    'Ama de llaves',
    'A y B Chairel',
    'Cocina Chairel',
    'Cocina eventos',
    'Compras',
    'Contabilidad',
    'Dirección',
    'Admon',
    'División cuartos',
    'Lavandería',
    'Mantenimiento',
    'Recursos humanos',
    'Ventas',
    'Vigilancia'
  ];


  // ================== CONTROL DE PASOS ==================
  step = 1;

  // ================== ROLES ==================
  currentUserRole = '';

  canRegister = false;
  canEdit = false;
  canChangeRole = false;

  // ================== ESTADO ==================
  isEditing = false;
  errorMessage: string | null = null;

  // ================== MODELO ==================
  employee: Employee = {
    num_nomina: '',
    rol: 'EMPLEADO', // CORREGIDO
    fecha_ingreso: new Date().toISOString().split('T')[0],
    puesto: '',
    departamento: '',

    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    fecha_nacimiento: '',
    edad: '',
    sexo: 'Masculino',
    estado_civil: 'Soltero/a',
    nacionalidad: 'Mexicana',

    correo: '',
    telefono: '',
    domicilio: '',

    rfc: '',
    curp: '',
    nss: '',

    password: ''
  };

  // ================== INIT ==================
  ngOnInit() {

    // 🔐 Obtener rol del usuario
    this.authService.getMe().subscribe({
      next: (user: any) => {
        this.currentUserRole = user.rol;
        this.setPermissions();
      },
      error: () => {
        this.router.navigate(['/login']);
      }
    });

    // ✏️ Edición
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditing = true;

      this.employeeService.getEmployeeById(+id).subscribe({
        next: (emp) => {
          this.employee = emp;

          this.employee.fecha_ingreso =
            emp.fecha_ingreso?.toString().substring(0, 10);

          this.employee.fecha_nacimiento =
            emp.fecha_nacimiento?.toString().substring(0, 10);
        },
        error: () => {
          alert('No se pudo cargar el empleado');
          this.router.navigate(['/admin/employees']);
        }
      });
    }
  }

  // ================== PERMISOS ==================
  setPermissions() {
    if (this.currentUserRole === 'ADMIN') {
      this.canRegister = true;
      this.canEdit = true;
      this.canChangeRole = true;
    }

    if (this.currentUserRole === 'ADMIN_EDITOR') {
      this.canEdit = true;
    }

    // ADMIN_LECTURA → solo ver
  }

  // ================== GUARDADO ==================

  onSave(): void {

    if (this.isEditing) {
      const id = this.route.snapshot.paramMap.get('id');
      if (!id) return;

      this.employeeService.updateEmployee(+id, this.employee).subscribe({
        next: () => {
          alert('Empleado actualizado correctamente');
          this.router.navigate(['/admin/employees']);
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          alert(err.error?.message || 'Error al actualizar empleado');
        }
      });
      return;
    }

    this.employeeService.addEmployee(this.employee).subscribe({
      next: () => {
        alert('Empleado registrado exitosamente');
        this.router.navigate(['/admin/employees']);
      },
      error: (err) => {
        console.error('Error al registrar:', err);
        alert(err.error?.message || 'Error al registrar empleado');
      }
    });
  }

  
  // ================== STEPS ==================
  nextStep() {
    if (this.step === 1) {
      this.step = 2;
    }
  }

  prevStep() {
    if (this.step === 2) {
      this.step = 1;
    }
  }

  soloNumeros(event: KeyboardEvent) {

    // permitir teclas especiales
    const teclasPermitidas = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
      'ArrowLeft', 'ArrowRight', 'Home', 'End'
    ];

    if (teclasPermitidas.includes(event.key)) return;

    // permitir solo números
    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }

  }

}