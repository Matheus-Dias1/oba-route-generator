import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-route-selector',
  templateUrl: './route-selector.component.html',
  styleUrls: ['./route-selector.component.css'],
})
export class RouteSelectorComponent implements OnInit {
  @Input() numSchools: number = 0;
  @Output() onSelect = new EventEmitter<number>();
  numRoutes = 1;

  constructor() {}

  ngOnInit(): void {}

  onClick(op: string) {
    if (op === 'ADD') this.numRoutes += 1;
    else if (op === 'SUB') this.numRoutes = Math.max(1, this.numRoutes - 1);
  }

  onSelection() {
    this.onSelect.emit(this.numRoutes);
  }
}
