import { inject, injectable } from 'inversify';
import Toast from 'react-native-root-toast';

import { Injectables } from '~config/ioc/injectables';

export type IToast = {
  show: typeof Toast.show;
  durations: typeof Toast.durations;
};
export type AlertLevel = 'error' | 'warning' | 'info';

export const AlertingBackgroundColors: Record<AlertLevel, string> = {
  error: '#ff0000',
  warning: '#ff9900',
  info: '#000000',
};
export const textColor = '#ffffff';
@injectable()
export class AlertingService {
  constructor(@inject(Injectables.Toast) private toast: IToast) {}
  alert(message: string, title?: string, level: AlertLevel = 'info') {
    const titleString = title ? `${title}: ` : '';
    this.toast.show(`${titleString}${message}`, {
      duration: Toast.durations.SHORT,
      backgroundColor: AlertingBackgroundColors[level],
      textColor,
    });
  }
}
