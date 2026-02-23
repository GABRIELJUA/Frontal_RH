import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersComponent, Employee } from './users.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../services/auth.service';
import { EmployeeService } from '../../services/employee.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('UsersComponent', () => {

  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let employeeService: jasmine.SpyObj<EmployeeService>;
  let router: Router;

  beforeEach(async () => {

    const authSpy = jasmine.createSpyObj('AuthService', ['getMe']);
    const employeeSpy = jasmine.createSpyObj('EmployeeService', [
      'getEmployees',
      'updatePermissions'
    ]);

    // 🔥 Valores por defecto (muy importante)
    authSpy.getMe.and.returnValue(of({ rol: 'ADMIN' }));
    employeeSpy.getEmployees.and.returnValue(of([]));
    employeeSpy.updatePermissions.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [
        UsersComponent,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: EmployeeService, useValue: employeeSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    employeeService = TestBed.inject(EmployeeService) as jasmine.SpyObj<EmployeeService>;
    router = TestBed.inject(Router);

    spyOn(router, 'navigate');
  });

  // ✅ 1
  it('Debe crearse el componente', () => {

    authService.getMe.and.returnValue(of({ rol: 'ADMIN' }));
    employeeService.getEmployees.and.returnValue(of([]));

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  // ✅ 2 No ADMIN
  it('Debe bloquear acceso si no es ADMIN', () => {

    authService.getMe.and.returnValue(of({ rol: 'EMPLEADO' }));

    fixture.detectChanges();

    expect(component.hasAccess).toBeFalse();
  });

  // ✅ 3 ADMIN carga empleados
  it('Debe cargar empleados si es ADMIN', () => {

    authService.getMe.and.returnValue(of({ rol: 'ADMIN' }));

    const fakeEmployees: any[] = [
      { id_empleado: 1, num_nomina: '1', rol: 'ADMIN', nombre: '', apellido_paterno: '', apellido_materno: '', fecha_nacimiento: '', sexo: '', estado_civil: '', rfc: '', curp: '', nss: '', correo: '', fecha_ingreso: '', puesto: '', departamento: '' },
      { id_empleado: 2, num_nomina: '2', rol: 'EMPLEADO', nombre: '', apellido_paterno: '', apellido_materno: '', fecha_nacimiento: '', sexo: '', estado_civil: '', rfc: '', curp: '', nss: '', correo: '', fecha_ingreso: '', puesto: '', departamento: '' }
    ];

    employeeService.getEmployees.and.returnValue(
      of(fakeEmployees) as any
    );

    fixture.detectChanges();

    expect(employeeService.getEmployees).toHaveBeenCalled();
    expect(component.employees.length).toBe(1); // Filtra EMPLEADO
    expect(component.loading).toBeFalse();
  });

  // ✅ 4 Error al cargar empleados
  it('Debe manejar error al cargar empleados', () => {

    authService.getMe.and.returnValue(of({ rol: 'ADMIN' }));
    employeeService.getEmployees.and.returnValue(
      throwError(() => new Error('Error'))
    );

    fixture.detectChanges();

    expect(component.loading).toBeFalse();
    expect(component.errorMessage).toBe('Error al cargar usuarios del sistema');
  });

  // ✅ 5 Guardar permisos
  it('Debe actualizar permisos correctamente', () => {

    component.selectedEmployee = {
      id_empleado: 1,
      num_nomina: '1',
      rol: 'ADMIN_EDITOR',
      nombre: '', apellido_paterno: '', apellido_materno: '',
      fecha_nacimiento: '', sexo: '', estado_civil: '',
      rfc: '', curp: '', nss: '', correo: '',
      fecha_ingreso: '', puesto: '', departamento: ''
    };

    employeeService.updatePermissions.and.returnValue(of({}));

    spyOn(window, 'alert');

    component.savePermissions();

    expect(employeeService.updatePermissions).toHaveBeenCalledWith(1, 'ADMIN_EDITOR');
  });

  // ✅ 6 Navegación
  it('Debe navegar a /admin', () => {
    component.goToAdmin();
    expect(router.navigate).toHaveBeenCalledWith(['/admin']);
  });

});