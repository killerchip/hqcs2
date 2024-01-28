import 'reflect-metadata';
import { Container } from 'inversify';

import { Injectables } from '~config/ioc/injectables';
import {
  AlertingBackgroundColors,
  AlertingService,
  IToast,
  textColor,
} from '~domains/shared/AlertingService/AlertingService';
import { AppTestHelper } from '~testHelpers/AppTestHelper';

describe('AlertingService', () => {
  let appTestHelper: AppTestHelper;
  let container: Container;
  let alertingService: AlertingService;
  let mockToast: IToast;

  beforeEach(() => {
    appTestHelper = new AppTestHelper();
    container = appTestHelper.container;
    alertingService = container.get(AlertingService);
    mockToast = appTestHelper.mockToast;
  });

  afterEach(() => {
    appTestHelper.reset();
  });

  it('is injectable as singleton', () => {
    const newMockToast = container.get(Injectables.Toast);
    expect(newMockToast).toBe(mockToast);
  });

  it('raises raises an info popup', () => {
    alertingService.alert('message');
    expect(mockToast.show).toHaveBeenCalledWith('message', {
      duration: mockToast.durations.SHORT,
      backgroundColor: AlertingBackgroundColors.info,
      textColor,
    });
  });

  it('raises a warning popup', () => {
    alertingService.alert('message', undefined, 'warning');
    expect(mockToast.show).toHaveBeenCalledWith('message', {
      duration: mockToast.durations.SHORT,
      backgroundColor: AlertingBackgroundColors.warning,
      textColor,
    });
  });

  it('raises an error popup', () => {
    alertingService.alert('message', undefined, 'error');
    expect(mockToast.show).toHaveBeenCalledWith('message', {
      duration: mockToast.durations.SHORT,
      backgroundColor: AlertingBackgroundColors.error,
      textColor,
    });
  });

  it('includes title in popup', () => {
    alertingService.alert('message', 'title');
    expect(mockToast.show).toHaveBeenCalledWith('title: message', {
      duration: mockToast.durations.SHORT,
      backgroundColor: AlertingBackgroundColors.info,
      textColor,
    });
  });
});
