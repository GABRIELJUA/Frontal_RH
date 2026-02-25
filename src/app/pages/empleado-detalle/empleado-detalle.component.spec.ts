import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EmpleadoDetalleComponent } from './empleado-detalle.component';
import { EmployeeService } from '../../services/employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('EmpleadoDetalleComponent', () => {

  let component: EmpleadoDetalleComponent;
  let fixture: ComponentFixture<EmpleadoDetalleComponent>;

  let employeeServiceSpy: jasmine.SpyObj<EmployeeService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {

    employeeServiceSpy = jasmine.createSpyObj('EmployeeService', ['getEmployeeById', 'resetPassword']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [EmpleadoDetalleComponent],
      providers: [
        { provide: EmployeeService, useValue: employeeServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1'
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmpleadoDetalleComponent);
    component = fixture.componentInstance;
    employeeServiceSpy.resetPassword.and.returnValue(of({}));
  });

  it('Debe crearse el componente', () => {

    employeeServiceSpy.getEmployeeById.and.returnValue(of({} as any));

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('Debe cargar empleado correctamente', () => {

    const mockEmployee = {
      id_empleado: 1,
      num_nomina: '123',
      rol: 'EMPLEADO',
      fecha_ingreso: '2020-01-01',
      puesto: 'Mesero',
      departamento: 'Servicio',
      nombre: 'Juan',
      apellido_paterno: 'Perez',
      apellido_materno: 'Lopez',
      fecha_nacimiento: '1990-01-01',
      edad: '34',
      sexo: 'M',
      estado_civil: 'Soltero',
      nacionalidad: 'Mexicana',
      correo: 'juan@test.com',
      telefono: '1234567890',
      domicilio: 'Calle 123',
      rfc: 'RFC123',
      curp: 'CURP123',
      nss: 'NSS123'
    };

    employeeServiceSpy.getEmployeeById.and.returnValue(of(mockEmployee as any));

    fixture.detectChanges();

    expect(component.employee).toEqual(mockEmployee as any);
    expect(component.loading).toBeFalse();
  });

  it('Debe redirigir si ocurre error al cargar empleado', () => {

    employeeServiceSpy.getEmployeeById.and.returnValue(
      throwError(() => new Error('Error'))
    );

    fixture.detectChanges();

    expect(component.errorMessage).toBe('No se pudo cargar el empleado');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/employees']);
  });

  it('Debe resetear contraseña si la confirmación es válida', () => {
    const mockEmployee = {
      id_empleado: 1,
      num_nomina: '123',
      rol: 'EMPLEADO',
      nombre: 'Juan',
      apellido_paterno: 'Perez'
    } as any;

    employeeServiceSpy.getEmployeeById.and.returnValue(of(mockEmployee));

    fixture.detectChanges();

    component.openResetPassword();
    component.resetPasswordData = {
      newPassword: '1234',
      confirmPassword: '1234'
    };

    component.saveResetPassword();

    expect(employeeServiceSpy.resetPassword).toHaveBeenCalledWith(1, '1234');
    expect(component.isResettingPassword).toBeFalse();
  });

  it('Debe bloquear reseteo si las contraseñas no coinciden', () => {
    const mockEmployee = {
      id_empleado: 1,
      num_nomina: '123',
      rol: 'EMPLEADO',
      nombre: 'Juan',
      apellido_paterno: 'Perez'
    } as any;

    employeeServiceSpy.getEmployeeById.and.returnValue(of(mockEmployee));

    fixture.detectChanges();

    component.openResetPassword();
    component.resetPasswordData = {
      newPassword: '1234',
      confirmPassword: '9999'
    };

    component.saveResetPassword();

    expect(employeeServiceSpy.resetPassword).not.toHaveBeenCalled();
    expect(component.toast.type).toBe('error');
  });

  it('Debe ocultar el toast automáticamente', fakeAsync(() => {
    component.toastMsg('ok', 'success');

    expect(component.toast.show).toBeTrue();
    tick(3000);
    expect(component.toast.show).toBeFalse();
  }));

});
