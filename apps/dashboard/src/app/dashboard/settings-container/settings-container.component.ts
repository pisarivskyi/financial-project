import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild, inject } from '@angular/core';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { updateValueAndValidity } from '../../shared/utils/form-utils';
import { SettingsFormComponent } from './components/settings-form/settings-form.component';
import { SettingsFacadeService } from './services/settings-facade.service';

@Component({
  selector: 'fpd-settings-container',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, SettingsFormComponent, NzButtonModule, NzSpinModule],
  templateUrl: './settings-container.component.html',
  styleUrls: ['./settings-container.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsContainerComponent implements OnInit {
  @ViewChild('form', { read: SettingsFormComponent, static: false })
  settingsFormComponent!: SettingsFormComponent;

  private settingsFacadeService = inject(SettingsFacadeService);

  isLoading$ = this.settingsFacadeService.isLoading$;

  settings$ = this.settingsFacadeService.settings$;

  ngOnInit(): void {
    this.settingsFacadeService.loadSettings();
  }

  onSave(): void {
    if (this.settingsFormComponent.formGroup.valid) {
      this.settingsFacadeService.updateSettings(this.settingsFormComponent.getUpdatedModel());
    } else {
      updateValueAndValidity(this.settingsFormComponent.formGroup.controls);
    }
  }
}
