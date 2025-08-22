export interface AppleLoginProps {
  onSuccess?: (user: {
    platform: 'ios' | 'android';
    id: string;
    name: string;
    email: string;
    identityToken?: string;
    idToken?: string;
    code?: string;
  }) => void;
  onError?: (error: any) => void;
  isSmall?: boolean;
}
