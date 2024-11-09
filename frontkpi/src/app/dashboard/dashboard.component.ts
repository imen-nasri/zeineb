import { Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { SalesService } from '../sales.service';
import { SaleService } from '../sale.service';
declare var google: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  salesData: any[] = [];
  turnoverData: any;

  loading = true;
  error: string | null = null;
  @ViewChild('pieChart') pieChart!: ElementRef;
  @ViewChild('lineChart') lineChart!: ElementRef;
   today = new Date();
   formattedDate = `${this.today.getFullYear()}-${String(this.today.getMonth() + 1).padStart(2, '0')}`;

  constructor(private salesService: SalesService , private saleService: SaleService) {}

  ngOnInit(): void {
    this.fetchSalesData();
    this.fetchTurnoverData();

  }

  fetchSalesData(): void {
    this.salesService.getSalesOverview().subscribe({
      next: (data) => {
        this.salesData = data; // Fetch the data from the service
        this.loading = false;
        this.drawPieChart();
      },
      error: (err) => {
        this.error = err;
        this.loading = false;
      }
    });
  }
  fetchTurnoverData(): void {
    this.saleService.getTurnover().subscribe({
      next: (data) => {
        this.turnoverData = data;
        console.log(this.turnoverData)
        this.drawLineChart();
      },
      error: (err) => {
        this.error = err;
        this.loading = false;
      }
    });
  }

  drawPieChart(): void {
    const chartData = [['Sale Overview', 'Total Sales']];
    
    this.salesData.forEach(item => {
      chartData.push([item.nom, item.ventesTotales]);
    });

    const data = google.visualization.arrayToDataTable(chartData);
    const options = {
      title: 'Item By Total Sales',
      backgroundColor: '#e2effb',
      pieSliceText: 'label',
      slices: {
        0: { color: '#88339f' },
        1: { color: '#cbbbc7' },
        2: { color: '#62a6ad' },
      },
      is3D: true,
    };
    const chart = new google.visualization.PieChart(this.pieChart.nativeElement);
    chart.draw(data, options);
  }

  drawLineChart(): void {
    const lineData = google.visualization.arrayToDataTable([
      ['Date', 'Turnover'],
      ["2024-08", 87],
      ["2024-09", 100],
      [new Date(new Date(this.formattedDate).setDate(new Date(this.formattedDate).getDate() - 1)).toISOString().split('T')[0], Math.floor(Math.random() * 1000) + 1],
      [this.formattedDate, this.turnoverData.turnover],
    ]);

    const options = {
      title: 'Monthly Turnover',
      curveType: 'function',
      legend: { position: 'bottom' },
      hAxis: { title: 'Time' },
      vAxis: { title: 'Turnover' },
    };

    const chart = new google.visualization.LineChart(this.lineChart.nativeElement);
    chart.draw(lineData, options);
  }

  ngAfterViewInit(): void {
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(() => {
      if (!this.loading) {
        this.drawPieChart();
        this.drawLineChart();
      }
    });
  }

}
