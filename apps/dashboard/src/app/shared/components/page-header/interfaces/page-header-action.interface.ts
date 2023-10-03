import { NzButtonType } from 'ng-zorro-antd/button';

export interface PageHeaderActionInterface {
  label: string;
  type: NzButtonType;
  action: () => void;
}
