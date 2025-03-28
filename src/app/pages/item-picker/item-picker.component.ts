import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import School from 'src/app/models/school';

@Component({
  selector: 'app-item-picker',
  templateUrl: './item-picker.component.html',
  styleUrls: ['./item-picker.component.css'],
})
export class ItemPickerComponent implements OnInit {
  @Input() files: School[][] = [];
  @Output() onPickItems = new EventEmitter<{
    selected: string[];
    date: string | null;
  }>();

  date: string | null = null;
  items: {
    [key: string]: boolean;
  } = {};
  constructor() {}

  ngOnInit(): void {
    this.files.flat().forEach((school) => {
      school.items.forEach((item) => {
        if (!this.items[item.description]) this.items[item.description] = true;
      });
    });
  }

  onClick(key: string) {
    this.items[key] = !this.items[key];
  }

  onContinue() {
    const selected: string[] = [];
    for (let key in this.items) {
      if (this.items[key]) selected.push(key);
    }
    this.onPickItems.emit({ selected, date: this.date });
  }
}
