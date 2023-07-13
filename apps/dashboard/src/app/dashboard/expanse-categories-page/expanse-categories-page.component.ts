import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { ExpanseCategoriesFacadeService } from './services/expanse-categories-facade.service';

@Component({
  selector: 'fpd-expanse-categories-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expanse-categories-page.component.html',
  styleUrls: ['./expanse-categories-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpanseCategoriesPageComponent implements OnInit {
  expanseCategories$ = this.expanseCategoriesService.expanseCategories$;

  isLoading$ = this.expanseCategoriesService.isLoading$;

  constructor(private expanseCategoriesService: ExpanseCategoriesFacadeService) {}

  ngOnInit(): void {
    this.expanseCategoriesService.getExpanseCategories();
  }
}
