import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import Clamp from 'clamp-js';
@Component({
  selector: 'app-class-preview',
  imports: [CommonModule, RouterLink],
  templateUrl: './class-preview.component.html',
  styleUrl: './class-preview.component.scss'
})
export class ClassPreviewComponent {
  @Input() classname!: string;
  @Input() descriptions!: string;
  @Input() username!: string;
  @Input() imageSrcs!: string[];
  @Input() classID!: string;
  @ViewChild('description', { static: false }) descriptionElement!: ElementRef;
  
  ngAfterViewInit() {
    if (this.descriptionElement) {
      Clamp(this.descriptionElement.nativeElement, { clamp: 2 });
    }
  }
}