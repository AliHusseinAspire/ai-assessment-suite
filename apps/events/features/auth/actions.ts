'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { loginSchema, registerSchema } from './schemas';
import type { AuthUser, ActionResult } from './types';

export async function signIn(
  formData: FormData
): Promise<ActionResult> {
  const rawData = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const parsed = loginSchema.safeParse(rawData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  // Sync user to our database
  await syncUser();

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function signUp(
  formData: FormData
): Promise<ActionResult> {
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  };

  const parsed = registerSchema.safeParse(rawData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { name: parsed.data.name },
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  if (data.user) {
    const existingByEmail = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });

    if (existingByEmail) {
      await prisma.user.update({
        where: { email: parsed.data.email },
        data: { supabaseId: data.user.id, name: parsed.data.name },
      });
    } else {
      await prisma.user.upsert({
        where: { supabaseId: data.user.id },
        update: { email: parsed.data.email, name: parsed.data.name },
        create: {
          email: parsed.data.email,
          name: parsed.data.name,
          supabaseId: data.user.id,
          role: 'GUEST',
        },
      });
    }
  }

  if (data.user && !data.session) {
    return { success: true, data: undefined };
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}

export async function syncUser(): Promise<AuthUser | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const dbUser = await prisma.user.upsert({
    where: { supabaseId: user.id },
    update: { email: user.email ?? '' },
    create: {
      email: user.email ?? '',
      name: user.user_metadata?.name ?? user.email?.split('@')[0] ?? 'User',
      supabaseId: user.id,
      role: 'GUEST',
    },
  });

  return {
    id: dbUser.id,
    email: dbUser.email,
    name: dbUser.name,
    role: dbUser.role,
    supabaseId: dbUser.supabaseId,
  };
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
  });

  if (!dbUser) return syncUser();

  return {
    id: dbUser.id,
    email: dbUser.email,
    name: dbUser.name,
    role: dbUser.role,
    supabaseId: dbUser.supabaseId,
  };
}
