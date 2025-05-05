import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ClassPreviewComponent } from "../../shared/component/class-preview/class-preview.component";

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, CommonModule, ClassPreviewComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  constructor(private route: Router) { }
  classPreviews = Array.from({ length: 4 }, () => {
    return {
      id:"idClass",
      username: "username",
      classname: "hello",
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      src: ["/assets/images/base.png","path2/to/image.png","path3/to/image.png","path4/to/image.png"]
    };
  });
}
