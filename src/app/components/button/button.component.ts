import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent implements OnInit {
  @Input() disabled = false;
  @Input() leaked = false;

  @Output() click = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  onClick() {
    this.click.emit();
  }
}
