import { TurboModuleRegistry } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  OneTapResponse,
  OneTapSuccessData,
  OneTapUser,
} from 'react-native-nitro-google-signin';

import { showToast } from '@/shared/ui/toast';

import { googleAuthKeys } from './query-keys';
import type { GoogleUser } from './types';

const isSuccessResponse = (
  response: OneTapResponse,
): response is OneTapResponse & { type: 'success'; data: { user: OneTapUser } } => {
  return response?.type === 'success' && response?.data != null;
};

const isCancelledResponse = (response: OneTapResponse): boolean => {
  return response?.type === 'cancelled';
};

const isNoSavedCredentialFoundResponse = (response: OneTapResponse): boolean => {
  return response?.type === 'noSavedCredentialFound';
};

interface NitroGoogleSignInModule {
  GoogleOneTapSignIn: {
    configure: (params: { webClientId: string; scopes?: string[] }) => void;
    checkPlayServices: (showErrorResolutionDialog?: boolean) => Promise<void>;
    signIn: () => Promise<OneTapResponse>;
    createAccount: () => Promise<OneTapResponse>;
    presentExplicitSignIn: () => Promise<OneTapResponse>;
    getCurrentUser: () => OneTapSuccessData | null;
    signOut: () => Promise<void>;
    getTokens: () => Promise<{ idToken: string; accessToken: string }>;
    requestScopes: (
      scopes: string[],
    ) => Promise<{ accessToken: string | null; serverAuthCode: string | null }>;
  };
  statusCodes?: Record<string, string>;
  isErrorWithCode?: (error: unknown) => error is { code: string; message: string };
}

let cachedModule: NitroGoogleSignInModule | null = null;
let isConfigured = false;

const isNitroAvailable = (): boolean => {
  const globalRecord = globalThis as Record<string, unknown>;
  if (globalRecord.NitroModulesProxy != null) {
    return true;
  }
  try {
    const turbo = TurboModuleRegistry.get('NitroModules');
    return turbo != null;
  } catch {
    return false;
  }
};

const getNitroGoogleSignIn = (): NitroGoogleSignInModule | null => {
  if (cachedModule) return cachedModule;
  if (!isNitroAvailable()) {
    return null;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require('react-native-nitro-google-signin') as NitroGoogleSignInModule;
    if (mod?.GoogleOneTapSignIn) {
      cachedModule = mod;
      return mod;
    }
    return null;
  } catch (error) {
    console.warn('[GoogleAuth] NitroGoogleSignin native module is not available:', error);
    return null;
  }
};

export const GOOGLE_SHEETS_FULL_SCOPE =
  'https://www.googleapis.com/auth/spreadsheets';

const ensureConfigured = (): NitroGoogleSignInModule | null => {
  const nitro = getNitroGoogleSignIn();
  if (!nitro) return null;
  if (isConfigured) return nitro;

  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  if (!webClientId) return nitro;

  try {
    nitro.GoogleOneTapSignIn.configure({
      webClientId,
    });
    isConfigured = true;
  } catch (error) {
    console.warn('[GoogleAuth] Failed to configure GoogleOneTapSignIn:', error);
  }

  return nitro;
};

export function useGoogleAuth() {
  const queryClient = useQueryClient();

  const { data: user = null, isLoading } = useQuery({
    queryKey: googleAuthKeys.user(),
    queryFn: async (): Promise<GoogleUser | null> => {
      const nitro = ensureConfigured();
      if (!nitro) return null;

      try {
        const currentUser = nitro.GoogleOneTapSignIn.getCurrentUser();
        return currentUser?.user ?? null;
      } catch {
        return null;
      }
    },
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const signInMutation = useMutation({
    mutationFn: async (): Promise<GoogleUser | null> => {
      const nitro = ensureConfigured();
      if (!nitro) {
        throw new Error('Google Sign-In недоступний у поточному середовищі');
      }

      await nitro.GoogleOneTapSignIn.checkPlayServices();

      let response = await nitro.GoogleOneTapSignIn.createAccount();

      if (isNoSavedCredentialFoundResponse(response)) {
        response = await nitro.GoogleOneTapSignIn.presentExplicitSignIn();
      }

      if (isSuccessResponse(response)) {
        return response.data.user;
      }

      if (isCancelledResponse(response) || isNoSavedCredentialFoundResponse(response)) {
        return null;
      }

      return null;
    },
    onSuccess: (newUser) => {
      if (newUser) {
        queryClient.setQueryData(googleAuthKeys.user(), newUser);
        showToast({
          type: 'success',
          text1: 'Вхід успішний',
          text2: newUser.name ?? newUser.email ?? undefined,
        });
      }
    },
    onError: (error) => {
      const nitro = getNitroGoogleSignIn();
      const isCancelled =
        (nitro?.isErrorWithCode?.(error) &&
          error.code === nitro?.statusCodes?.SIGN_IN_CANCELLED) ||
        (error instanceof Error &&
          (error.message.toLowerCase().includes('cancel') ||
            error.message.includes('16:') ||
            error.message.toLowerCase().includes('no credential')));

      if (isCancelled) {
        return;
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Не вдалося увійти через Google';

      showToast({
        type: 'error',
        text1: 'Помилка входу через Google',
        text2: errorMessage,
      });
    },
  });

  const signOutMutation = useMutation({
    mutationFn: async (): Promise<void> => {
      const nitro = ensureConfigured();
      if (!nitro) return;
      await nitro.GoogleOneTapSignIn.signOut();
    },
    onSuccess: () => {
      queryClient.setQueryData(googleAuthKeys.user(), null);
      showToast({
        type: 'info',
        text1: 'Ви вийшли з акаунта Google',
      });
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : 'Не вдалося вийти з акаунта';
      showToast({
        type: 'error',
        text1: 'Помилка виходу',
        text2: errorMessage,
      });
    },
  });

  const signIn = async () => {
    return signInMutation.mutateAsync();
  };

  const signOut = async () => {
    return signOutMutation.mutateAsync();
  };

  const ensureSheetsScopeAndGetToken = async (): Promise<string> => {
    const nitro = ensureConfigured();
    if (!nitro) {
      throw new Error('Google Sign-In недоступний у поточному середовищі');
    }

    const currentUser = nitro.GoogleOneTapSignIn.getCurrentUser();
    const grantedScopes = currentUser?.scopes ?? [];

    if (!grantedScopes.includes(GOOGLE_SHEETS_FULL_SCOPE)) {
      try {
        const authResult = await nitro.GoogleOneTapSignIn.requestScopes([
          GOOGLE_SHEETS_FULL_SCOPE,
        ]);
        if (authResult?.accessToken) {
          return authResult.accessToken;
        }
      } catch (err) {
        console.warn('[GoogleAuth] requestScopes error:', err);
      }
    }

    const tokens = await nitro.GoogleOneTapSignIn.getTokens();
    if (!tokens?.accessToken) {
      throw new Error('Не вдалося отримати Google access token');
    }
    return tokens.accessToken;
  };

  const getAccessToken = async (): Promise<string> => {
    const nitro = ensureConfigured();
    if (!nitro) {
      throw new Error('Google Sign-In недоступний у поточному середовищі');
    }

    const tokens = await nitro.GoogleOneTapSignIn.getTokens();
    if (!tokens?.accessToken) {
      throw new Error('Не вдалося отримати Google access token');
    }
    return tokens.accessToken;
  };

  const getCurrentUserScopes = (): string[] | undefined => {
    const nitro = ensureConfigured();
    return nitro?.GoogleOneTapSignIn.getCurrentUser()?.scopes;
  };

  return {
    user,
    isLoading,
    isSigningIn: signInMutation.isPending,
    isSigningOut: signOutMutation.isPending,
    signIn,
    signOut,
    getAccessToken,
    ensureSheetsScopeAndGetToken,
    getCurrentUserScopes,
  };
}
