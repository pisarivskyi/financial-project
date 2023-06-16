import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpansesService } from './services/expanses.service';

@Component({
  selector: 'fpd-expanses-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expanses-page.component.html',
  styleUrls: ['./expanses-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpansesPageComponent implements OnInit {
  expanses$ = this.expansesService.expanses$;

  isLoading$ = this.expansesService.isLoading$;

  constructor(private expansesService: ExpansesService) {
  }

  ngOnInit(): void {
    this.expansesService.getExpanses();
  }
}
