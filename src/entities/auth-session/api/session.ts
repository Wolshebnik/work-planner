import { supabase } from '@/shared/api/supabase';

type LoginCredentials = {
  email: string;
  password: string;
};

const getLoginCredentials = (): LoginCredentials => {
  const email = process.env.EXPO_PUBLIC_LOGIN;
  const password = process.env.EXPO_PUBLIC_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'EXPO_PUBLIC_LOGIN и EXPO_PUBLIC_PASSWORD должны быть заданы в .env',
    );
  }

  return { email, password };
};

export const getCurrentSession = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session;
};

export const signInWithCredentials = async () => {
  const { email, password } = getLoginCredentials();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data.session;
};
