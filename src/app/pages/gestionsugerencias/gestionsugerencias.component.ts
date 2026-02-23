import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SugerenciasService } from '../../services/sugerencias.service';
import { Sugerencia } from '../../models/sugerencia.model';

@Component({
  selector: 'app-gestionsugerencias',
  imports: [CommonModule],
  templateUrl: './gestionsugerencias.component.html',
  styleUrl: './gestionsugerencias.component.css'
})
export class GestionsugerenciasComponent implements OnInit {

  

  sugerencias: Sugerencia[] = [];
  loading = true;

  verSugerencia = false;
  sugerenciaSeleccionada: Sugerencia | null = null;

  constructor(private sugerenciasService: SugerenciasService) {}

  ngOnInit() {
    this.sugerenciasService.getAll().subscribe({
      next: (data) => {
        this.sugerencias = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  abrirDetalle(s: Sugerencia) {
    this.sugerenciaSeleccionada = s;
    this.verSugerencia = true;
  }

  cerrarDetalle() {
    this.verSugerencia = false;
    this.sugerenciaSeleccionada = null;
  }
}