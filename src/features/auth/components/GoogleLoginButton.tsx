import { useCallback } from 'react';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useAuthStore } from '@/stores';
import { authService } from '@/services';

interface GoogleLoginButtonProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function GoogleLoginButton({ onSuccess, onError }: GoogleLoginButtonProps) {
  const { login, setLoading } = useAuthStore();

  const handleSuccess = useCallback(
    async (credentialResponse: CredentialResponse) => {
      if (!credentialResponse.credential) {
        onError?.(new Error('No credential received'));
        return;
      }

      setLoading(true);

      try {
        const result = await authService.handleGoogleLogin({
          credential: credentialResponse.credential,
          select_by: credentialResponse.select_by || 'auto',
          clientId: credentialResponse.clientId || '',
        });

        if (result) {
          login(result.user, result.token);
          onSuccess?.();
        } else {
          throw new Error('Failed to authenticate');
        }
      } catch (error) {
        onError?.(error instanceof Error ? error : new Error('Authentication failed'));
      } finally {
        setLoading(false);
      }
    },
    [login, setLoading, onSuccess, onError]
  );

  const handleError = useCallback(() => {
    onError?.(new Error('Google Sign-In was unsuccessful'));
  }, [onError]);

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleError}
      useOneTap
      theme="filled_black"
      shape="pill"
      size="large"
      text="signin_with"
    />
  );
}
