import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-base',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './base.component.html',
  styleUrl: './base.component.scss'
})
export class BaseComponent {
  svgList = [
    { src: '/assets/images/BlobsVector2.svg', width: 365, height: 458,top:90,left:24 },
    { src: '/assets/images/BlobsVector.svg', width: 367, height: 420, top:50,left:150},
    { src: '/assets/images/BlobsVector1.svg', width: 382, height: 325,top:345,left:45},
  ];
  srcImg = {src:'/assets/images/MainImage.png', top:130,left:70}
}
