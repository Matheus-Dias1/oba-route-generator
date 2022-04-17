import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import School from 'src/app/models/school';

import mergeSchools from '../../helpers/mergeSchool';

@Component({
  selector: 'app-matcher',
  templateUrl: './matcher.component.html',
  styleUrls: ['./matcher.component.css'],
})
export class MatcherComponent implements OnInit {
  @Output() matchesDone = new EventEmitter<School[]>();
  @Input('files') _files: School[][] = [];

  matching: School[] = [];
  looking: School[] = [];
  selected = -1;

  merged: School[] = [];
  files: School[][] = [];

  constructor() {}

  ngOnInit(): void {
    this.files = [...this._files];
    this.merged = this.files.shift()!;
    this.autoMatch();
  }

  autoMatch() {
    const s1 = this.merged;
    const s2 = this.files.shift()!;

    const { matched, unmathced } = mergeSchools(s1, s2);
    this.merged = matched;

    this.matching = unmathced[0];
    this.looking = unmathced[1];
  }

  // school not in list (not present in the first csv)
  onNotInList() {
    const newSchool = this.matching.shift()!;
    this.merged.push(newSchool);
  }

  onMatch() {
    const s1 = this.matching.shift()!;
    const [s2] = this.looking.splice(this.selected, 1);

    s1.items = [...s1.items, ...s2.items];
    this.merged.push(s1);
  }

  onClick(type: string) {
    if (type === 'NO_MATCH') this.onNotInList();
    else if (type === 'MATCH') this.onMatch();

    if (!this.matching.length) {
      this.merged.push(...this.looking);
      this.looking = [];
    }
    if (!this.looking.length) {
      this.merged.push(...this.matching);
      this.matching = [];
    }

    // still matching to do, continue...
    if (this.matching.length + this.looking.length) return;
    // matching done for this file, matching new file
    if (this.files.length) this.autoMatch();
    // matching done for all files
    else this.matchesDone.emit(this.merged);
  }
}
