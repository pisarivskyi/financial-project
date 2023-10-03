import { NzConfig } from 'ng-zorro-antd/core/config';

import { FORM_AUTO_TIPS } from '../../shared/constants/form-auto-tips.const';

export const nzConfigFactory = (): NzConfig => {
  return {
    form: {
      nzAutoTips: FORM_AUTO_TIPS,
    },
  };
};
