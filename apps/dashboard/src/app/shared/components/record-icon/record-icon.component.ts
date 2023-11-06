import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { NzIconModule } from 'ng-zorro-antd/icon';

import { RecordModel } from '../../../api/records/models/record.model';
import { COMPANY_TO_LOGO } from '../../constants/company-to-logo.const';

@Component({
  selector: 'fpd-record-icon',
  standalone: true,
  imports: [CommonModule, NzIconModule],
  templateUrl: './record-icon.component.html',
  styleUrls: ['./record-icon.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecordIconComponent {
  @Input()
  record: RecordModel | null = null;

  protected readonly COMPANY_TO_LOGO = COMPANY_TO_LOGO;
}
