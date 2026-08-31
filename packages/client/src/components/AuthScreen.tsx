/**
 * Sign in and registration.
 *
 * Field-level errors come back from the server's validation envelope, so the
 * rules are enforced in exactly one place and the form simply displays what it
 * is told.
 */

import { useState, type FormEvent } from 'react';

import { PASSWORD_MIN_LENGTH, type PublicUser } from '@soc/shared';

import { ApiCallError, auth } from '../lib/api';

interface AuthScreenProps {
  onSignedIn: (user: PublicUser) => void;
}

type Mode = 'login' | 'register';

export function AuthScreen({ onSignedIn }: AuthScreenProps) {
  const [mode, setMode] = useState<Mode>('login');
  const [identifier, setIdentifier] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    setFields({});

    try {
      const result =
        mode === 'login'
          ? await auth.login(identifier, password)
          : await auth.register(username, email, password);
      onSignedIn(result.user);
    } catch (error) {
      if (error instanceof ApiCallError) {
        setMessage(error.error.message);
        setFields(error.error.fields ?? {});
      } else {
        setMessage('Could not reach the server. Is it running on port 4000?');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-screen">
      <form className="auth-card" onSubmit={submit}>
        <h1>
          <span className="dot" style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--pass)', display: 'inline-block' }} />
          Ridgeline SOC Trainer
        </h1>
        <p className="sub">
          {mode === 'login'
            ? 'Sign in to continue your training.'
            : 'Create an account to start Linux Fundamentals.'}
        </p>

        {message && <div className="auth-error">{message}</div>}

        {mode === 'login' ? (
          <div className="field">
            <label htmlFor="identifier">Username or email</label>
            <input
              id="identifier"
              value={identifier}
              autoComplete="username"
              onChange={(event) => setIdentifier(event.target.value)}
              required
            />
          </div>
        ) : (
          <>
            <div className="field">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                value={username}
                autoComplete="username"
                onChange={(event) => setUsername(event.target.value)}
                required
              />
              {fields.username && <div className="err">{fields.username}</div>}
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                autoComplete="email"
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              {fields.email && <div className="err">{fields.email}</div>}
            </div>
          </>
        )}

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          {fields.password && <div className="err">{fields.password}</div>}
          {mode === 'register' && !fields.password && (
            <div className="err" style={{ color: 'var(--text-faint)' }}>
              At least {PASSWORD_MIN_LENGTH} characters.
            </div>
          )}
        </div>

        <button className="btn primary" type="submit" disabled={busy}>
          {busy ? 'Working…' : mode === 'login' ? 'Sign in' : 'Create account'}
        </button>

        <div className="switch-mode">
          {mode === 'login' ? (
            <>
              No account yet?{' '}
              <button type="button" onClick={() => { setMode('register'); setMessage(null); }}>
                Create one
              </button>
            </>
          ) : (
            <>
              Already registered?{' '}
              <button type="button" onClick={() => { setMode('login'); setMessage(null); }}>
                Sign in
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
