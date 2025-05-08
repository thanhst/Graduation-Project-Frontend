import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { FlagService } from '../../../core/services/flag/flag.service';

@Component({
  selector: 'app-view-statistical',
  imports: [ReactiveFormsModule, CommonModule, NgChartsModule  ],
  templateUrl: './view-statistical.component.html',
  styleUrl: './view-statistical.component.scss',
})
export class ViewStatisticalComponent {
  pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Category A', 'Category B', 'Category C'],
    datasets: [
      {
        data: [300, 500, 100],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      }
    ]
  };
  pieChartType: ChartType = 'pie';

  // Biểu đồ đường (line chart)
  lineChartData: ChartData<'line'> = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Series A',
        data: [65, 59, 80, 81, 56, 55, 40],
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
      {
        label: 'Series B',
        data: [28, 48, 40, 19, 86, 27, 90],
        borderColor: 'rgba(153,102,255,1)',
        fill: false,
      }
    ]
  };
  lineChartOptions: ChartOptions = {
    responsive: true
  };
  lineChartType: ChartType = 'line';
  lineChartLegend = true;

  constructor(private location: Location, private flagService: FlagService) {
    this.flagService.setActiveScheduler(true);
    this.flagService.setActiveSchedulerNotification(true);
    this.flagService.setActiveSidebarRight(false);
    this.flagService.setTitle("Statistical");
  }

  // Go back to previous page
  goBack() {
    this.location.back();
  }
}
