import { supabase, type Session } from '@/lib/supabase';
import type { RepositoryInfo } from '@/types';

const SESSION_DURATION = 30 * 60 * 1000;

export interface SessionData {
  id: string;
  repositoryInfo: RepositoryInfo;
  createdAt: Date;
  lastAccessedAt: Date;
  expiresAt: Date;
}

export async function createSession(
  repositoryInfo: RepositoryInfo
): Promise<string | null> {
  try {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + SESSION_DURATION);

    const { data, error } = await supabase
      .from('sessions')
      .insert({
        owner: repositoryInfo.owner,
        repo: repositoryInfo.repo,
        branch: repositoryInfo.branch || 'main',
        expires_at: expiresAt.toISOString(),
        last_accessed_at: now.toISOString(),
        is_active: true,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating session:', error);
      return null;
    }

    return data.id;
  } catch (error) {
    console.error('Exception creating session:', error);
    return null;
  }
}

export async function getSession(
  sessionId: string
): Promise<SessionData | null> {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return null;
    }

    const session = data as Session;
    const now = new Date();
    const expiresAt = new Date(session.expires_at);

    if (expiresAt < now) {
      await supabase
        .from('sessions')
        .update({ is_active: false })
        .eq('id', sessionId);

      return null;
    }

    return {
      id: session.id,
      repositoryInfo: {
        owner: session.owner,
        repo: session.repo,
        branch: session.branch,
      },
      createdAt: new Date(session.created_at),
      lastAccessedAt: new Date(session.last_accessed_at),
      expiresAt: expiresAt,
    };
  } catch (error) {
    console.error('Exception getting session:', error);
    return null;
  }
}

export async function updateSessionAccess(
  sessionId: string
): Promise<boolean> {
  try {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + SESSION_DURATION);

    const { error } = await supabase
      .from('sessions')
      .update({
        last_accessed_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
      })
      .eq('id', sessionId)
      .eq('is_active', true);

    if (error) {
      console.error('Error updating session:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception updating session:', error);
    return false;
  }
}

export async function deleteSession(sessionId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('sessions')
      .update({ is_active: false })
      .eq('id', sessionId);

    if (error) {
      console.error('Error deleting session:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception deleting session:', error);
    return false;
  }
}

export async function getSessionTimeRemaining(
  sessionId: string
): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .select('expires_at')
      .eq('id', sessionId)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return 0;
    }

    const expiresAt = new Date(data.expires_at);
    const now = new Date();
    const remaining = expiresAt.getTime() - now.getTime();

    return Math.max(0, remaining);
  } catch (error) {
    console.error('Exception getting time remaining:', error);
    return 0;
  }
}

export async function cleanupExpiredSessions(): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .update({ is_active: false })
      .lt('expires_at', new Date().toISOString())
      .eq('is_active', true)
      .select('id');

    if (error) {
      console.error('Error cleaning up sessions:', error);
      return 0;
    }

    return data?.length || 0;
  } catch (error) {
    console.error('Exception cleaning up sessions:', error);
    return 0;
  }
}