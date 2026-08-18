import { getCurrentSession, signInWithCredentials } from '../api/session';

export const ensureSession = async () => {
  const session = await getCurrentSession();

  if (session) {
    return session;
  }

  return signInWithCredentials();
};
