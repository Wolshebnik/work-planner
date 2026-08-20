import Toast, {
  type ToastShowParams,
  type ToastType,
} from 'react-native-toast-message';

export type AppToastType = 'success' | 'error' | 'info';

export type AppToastShowParams = {
  type: AppToastType;
  text1: string;
  text2?: string;
  visibilityTime?: number;
  autoHide?: boolean;
};

const mapType = (type: AppToastType): ToastType => type;

export const showToast = (params: AppToastShowParams): void => {
  const toastParams: ToastShowParams = {
    type: mapType(params.type),
    text1: params.text1,
    visibilityTime: params.visibilityTime ?? 5000,
    ...(params.text2 !== undefined && { text2: params.text2 }),
    ...(params.autoHide !== undefined && { autoHide: params.autoHide }),
  };

  Toast.show(toastParams);
};

export const hideToast = (): void => {
  Toast.hide();
};