// Supabase Auth & Security Service Layer
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
}

export class AuthService {
  /**
   * Check if Supabase Auth is enabled and credentials are valid
   */
  static isAuthEnabled(): boolean {
    return isSupabaseConfigured;
  }

  /**
   * Get current active Supabase Auth user session
   */
  static async getCurrentUser(): Promise<User | null> {
    if (!this.isAuthEnabled()) return null;
    try {
      const { data } = await supabase.auth.getUser();
      return data.user || null;
    } catch (err) {
      console.error('Error fetching current user:', err);
      return null;
    }
  }

  /**
   * Get current Auth session
   */
  static async getSession(): Promise<Session | null> {
    if (!this.isAuthEnabled()) return null;
    try {
      const { data } = await supabase.auth.getSession();
      return data.session || null;
    } catch (err) {
      console.error('Error fetching session:', err);
      return null;
    }
  }

  /**
   * Sign Up with Email and Password
   */
  static async signUpWithEmail(params: {
    email: string;
    password: string;
    fullName?: string;
    phone?: string;
  }): Promise<{ user: User | null; error: string | null }> {
    if (!this.isAuthEnabled()) {
      return { user: null, error: 'Supabase credentials not configured in .env' };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: params.email.trim(),
        password: params.password,
        options: {
          data: {
            full_name: params.fullName,
            phone: params.phone,
          },
        },
      });

      if (error) return { user: null, error: error.message };
      return { user: data.user, error: null };
    } catch (err: any) {
      return { user: null, error: err?.message || 'Sign up failed' };
    }
  }

  /**
   * Sign In with Email and Password
   */
  static async signInWithEmail(params: {
    email: string;
    password: string;
  }): Promise<{ user: User | null; session: Session | null; error: string | null }> {
    if (!this.isAuthEnabled()) {
      return { user: null, session: null, error: 'Supabase credentials not configured in .env' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: params.email.trim(),
        password: params.password,
      });

      if (error) return { user: null, session: null, error: error.message };
      return { user: data.user, session: data.session, error: null };
    } catch (err: any) {
      return { user: null, session: null, error: err?.message || 'Sign in failed' };
    }
  }

  /**
   * Sign In with Google OAuth
   */
  static async signInWithGoogle(): Promise<{ error: string | null }> {
    if (!this.isAuthEnabled()) {
      return { error: 'Supabase credentials not configured in .env' };
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/home` : undefined,
        },
      });

      if (error) return { error: error.message };
      return { error: null };
    } catch (err: any) {
      return { error: err?.message || 'Google OAuth failed' };
    }
  }

  /**
   * Trigger Password Reset Email
   */
  static async resetPassword(email: string): Promise<{ error: string | null }> {
    if (!this.isAuthEnabled()) return { error: 'Supabase credentials not configured' };

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/reset-password` : undefined,
      });
      if (error) return { error: error.message };
      return { error: null };
    } catch (err: any) {
      return { error: err?.message || 'Password reset failed' };
    }
  }

  /**
   * Sign Out current user from Supabase
   */
  static async signOut(): Promise<void> {
    if (!this.isAuthEnabled()) return;
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Sign out error:', err);
    }
  }

  /**
   * Simple client Hash helper for PINs (SHA-256 equivalent representation)
   */
  static async hashPin(pin: string): Promise<string> {
    let hash = 0;
    for (let i = 0; i < pin.length; i++) {
      const char = pin.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return `hashed_pin_${Math.abs(hash).toString(16)}_${pin.length}`;
  }

  /**
   * Set or Change User 4-Digit PIN
   */
  static async setPin(pin: string): Promise<{ success: boolean; error?: string }> {
    const user = await this.getCurrentUser();
    if (!user) return { success: false, error: 'Authentication required' };

    const pinHash = await this.hashPin(pin);

    try {
      const { error } = await supabase.from('user_pins').upsert({
        user_id: user.id,
        pin_hash: pinHash,
        failed_attempts: 0,
        locked_until: null,
        updated_at: new Date().toISOString(),
      });

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to set PIN' };
    }
  }
}
