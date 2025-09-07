import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

let isResetting = false;

export function resetToLogin() {
  if (isResetting) return;
  isResetting = true;
  try {
    if (navigationRef.isReady()) {
      navigationRef.reset({ index: 0, routes: [{ name: 'Login' }] });
    }
  } finally {
    // allow subsequent resets after a short delay to prevent loops
    setTimeout(() => { isResetting = false; }, 500);
  }
}


