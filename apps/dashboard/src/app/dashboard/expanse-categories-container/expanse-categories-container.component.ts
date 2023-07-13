import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { ExpanseCategoriesFacadeService } from './services/expanse-categories-facade.service';

@Component({
  selector: 'fpd-expanse-categories-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expanse-categories-container.component.html',
  styleUrls: ['./expanse-categories-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpanseCategoriesContainerComponent implements OnInit {
  expanseCategories$ = this.expanseCategoriesService.expanseCategories$;

  isLoading$ = this.expanseCategoriesService.isLoading$;

  constructor(private expanseCategoriesService: ExpanseCategoriesFacadeService) {}

  ngOnInit(): void {
    this.expanseCategoriesService.getExpanseCategories();
  }
}
