import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-buzon',
  imports: [CommonModule, FormsModule],
  templateUrl: './buzon.component.html',
  styleUrl: './buzon.component.css'
})
export class BuzonComponent {

  comentario: string = '';

  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  errorMessage: string = '';
  isSending: boolean = false;

  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.errorMessage = '';

    if (!file) return;

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      this.errorMessage = 'Solo se permiten imágenes JPG o PNG';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.errorMessage = 'La imagen no debe superar los 5MB';
      return;
    }

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => this.imagePreview = reader.result;
    reader.readAsDataURL(file);
  }

  removeImage() {
    this.selectedFile = null;
    this.imagePreview = null;
  }

  enviarMensaje() {
    this.isSending = true;

    const formData = new FormData();
    formData.append('comentario', this.comentario);

    if (this.selectedFile) {
      formData.append('imagen', this.selectedFile);
    }

    this.http.post('http://localhost:3000/api/sugerencias', formData)
      .subscribe({
        next: () => {
          this.show('Sugerencia enviada correctamente', 'success');
          this.reset();
        },
        error: () => {
          this.show('Error al enviar la sugerencia', 'error');
          this.isSending = false;
        }
      });
  }

  reset() {
    this.comentario = '';
    this.selectedFile = null;
    this.imagePreview = null;
    this.errorMessage = '';
    this.isSending = false;
  }

  show(msg: string, type: 'success' | 'error') {
    this.toastMessage = msg;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => this.showToast = false, 4000);
  }
}