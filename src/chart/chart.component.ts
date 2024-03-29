import {
    AfterViewInit,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
  } from '@angular/core';
  import Chart from 'chart.js/auto';
  import { getChartLabelPlugin, PLUGIN_ID } from 'chart.js-plugin-labels-dv';
  
  @Component({
    selector: 'app-chart',
    templateUrl: './chart.component.html',
    standalone: true,
    styleUrls: ['./chart.component.scss'],
  })
  export class ChartComponent implements AfterViewInit, OnChanges {
    private static instanceCount: number = 0;
  
    @Input() chartConfig: any;
    @Output() chartCreated: EventEmitter<Chart> = new EventEmitter<Chart>();
  
    public readonly name: string = `chart-${ChartComponent.instanceCount++}`;
    private chart?: Chart;
  
    constructor() {}
  
    ngAfterViewInit(): void {
      this.createChart();
    }
  
    ngOnChanges(): void {
      if (!this.chart) {
        return;
      }
      this.chart.destroy();
      this.createChart();
    }
  
    private createChart(): void {
      if (!this.hasRegisteredPlugin()) {
        Chart.register(getChartLabelPlugin());
      }
  
      this.chart = new Chart(this.name, this.chartConfig);
      this.chartCreated.emit(this.chart);
    }
  
    private hasRegisteredPlugin(): boolean {
      console.log('Chart.registry:', Chart.registry);
      return !!Chart.registry?.plugins.get(PLUGIN_ID);
    }
  }
  