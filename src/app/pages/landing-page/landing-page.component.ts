import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent implements OnInit, OnDestroy {
  // Ahora es un arreglo de objetos con URL y Ruta de destino
  images = [
    { url: 'assets/img/banner/prueba.png', route: '/protocolo' },
    { url: 'assets/img/banner/Imagen1.png', route: '/buzon' },
    { url: 'assets/img/banner/prueba2.png', route: '/login' }
  ];

  currentImageIndex: number = 0;
  private intervalId: any;

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.nextImage();
    }, 3000);
  }

  ngOnDestroy(): void {
    if(this.intervalId) clearInterval(this.intervalId);
  }

  nextImage() {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
  }

  setSlide(index: number) {
    this.currentImageIndex = index;
  }

  trackByImage(index: number, item: any): string {
  return item.url;
}
}