import { Component, TemplateRef, ViewChild } from '@angular/core';

import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  template: `
    <ng-template #nzIndicatorTpl>
      <span class="ant-spin-dot">
        <span nz-icon [nzType]="'loading'"></span>
      </span>
    </ng-template>
  `,
  standalone: true,
  imports: [NzIconModule],
})
export class GlobalTemplatesComponent {
  @ViewChild('nzIndicatorTpl', { static: true })
  nzIndicator!: TemplateRef<void>;
}
