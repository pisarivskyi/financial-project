import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpanseCategoriesService } from './services/expanse-categories.service';

@Component({
  selector: 'fpd-expanse-categories-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expanse-categories-page.component.html',
  styleUrls: ['./expanse-categories-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpanseCategoriesPageComponent implements OnInit {
  expanseCategories$ = this.expanseCategoriesService.expanseCategories$;

  isLoading$ = this.expanseCategoriesService.isLoading$;

  constructor(private expanseCategoriesService: ExpanseCategoriesService) {
  }

  ngOnInit(): void {
    this.expanseCategoriesService.getExpanseCategories();
  }
}

