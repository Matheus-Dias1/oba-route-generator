import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { getReceipt, getRoutesList } from 'src/app/helpers/pdf/generatePDFs';
import routes from 'src/app/models/routes';

@Component({
  selector: 'app-finish',
  templateUrl: './finish.component.html',
  styleUrls: ['./finish.component.css'],
})
export class FinishComponent implements OnInit {
  @Input() routes: routes = {};
  @Input() selectedItems: string[] = [];
  @Input() date: string | null = null;

  @Output() onRestart = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  onDownloadClick() {
    getReceipt(this.routes, this.selectedItems, this.date);
    getRoutesList(this.routes);
  }

  onRestartClick() {
    this.onRestart.emit();
  }
}
