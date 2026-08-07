import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { User, Upload, CheckCircle2, AlertCircle, Trophy, Puzzle, History, Shield, Zap } from 'lucide-react';
import { User as UserType } from '../types';

export default function ProfilePage() {
  const { user, loading: authLoading, updateUserProfile } = useAuth();
  const [profileStats, setProfileStats] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadMessage, setUploadMessage] = useState<string>('');
  const [uploadError, setUploadError] = useState<string>('');

  useEffect(() => {
    async function fetchProfileData() {
      if (!user) return;
      try {
        const data = await api.getProfile();
        setProfileStats(data.user);
      } catch (err: any) {
        setError(err.message || 'Errore nel caricamento del profilo');
      } finally {
        setLoading(false);
      }
    }
    fetchProfileData();
  }, [user]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setUploadMessage('');
      setUploadError('');
    }
  };

  const handleAvatarUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setUploadMessage('');
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('avatar', selectedFile);

      const response = await api.uploadAvatar(formData);
      setUploadMessage('AVATAR AGGIORNATO CON SUCCESSO!');
      
      updateUserProfile({ avatar_url: response.avatar_url });
      setProfileStats((prev) => prev ? { ...prev, avatar_url: response.avatar_url } : null);
      setSelectedFile(null);
    } catch (err: any) {
      setUploadError(err.message || 'Errore nel caricamento avatar');
    } finally {
      setUploading(false);
    }
  };

  if (authLoading) {
    return <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)', fontFamily: 'var(--font-hud)' }}>CARICAMENTO PROFILO...</div>;
  }

  if (!user) {
    return (
      <div className="cyber-stat-card" style={{ textAlign: 'center', padding: '3rem 1.5rem', maxWidth: '600px', margin: '0 auto' }}>
        <AlertCircle size={40} style={{ color: 'var(--neon-pink)', marginBottom: '1rem' }} />
        <h2 style={{ color: '#ffffff' }}>ACCESSO RICHIESTO</h2>
        <p style={{ color: 'var(--text-muted)' }}>Accedi per visualizzare e gestire la tua scheda utente cyberware.</p>
      </div>
    );
  }

  const riddlesCreated = profileStats?.riddles_created ?? profileStats?.created_count ?? profileStats?.stats?.created_count ?? 0;
  const riddlesSolved = profileStats?.riddles_solved ?? profileStats?.solved_count ?? profileStats?.stats?.solved_count ?? 0;
  const avgAttempts = profileStats?.avg_attempts ?? profileStats?.stats?.avg_attempts;

  return (
    <div style={{ maxWidth: '950px', margin: '0 auto' }}>
      {/* Cyber Profile Header */}
      <div className="cyber-stat-card" style={{ marginBottom: '2.5rem', padding: '2rem', border: '2px solid var(--neon-purple)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.8rem', flexWrap: 'wrap' }}>
          <div className="avatar-pixel-frame" style={{ width: '96px', height: '96px', borderWidth: '3px' }}>
            {previewUrl || (profileStats && profileStats.avatar_url) || user.avatar_url ? (
              <img
                src={previewUrl || (profileStats && profileStats.avatar_url) || user.avatar_url || ''}
                alt={user.username}
                className="avatar-img"
              />
            ) : (
              <span className="avatar-placeholder-pixel" style={{ fontSize: '2.5rem' }}>
                {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
              </span>
            )}
          </div>

          <div>
            <div className="hud-tag hud-tag-purple" style={{ marginBottom: '0.4rem' }}>
              <Shield size={12} /> OPERATORE DI RETE
            </div>
            <h1 className="page-title-neon" style={{ fontSize: '2.4rem' }}>
              {user.username}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.2rem' }}>
              @{user.username} • {user.email}
            </p>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        {/* Avatar Upload Console */}
        <div className="cyber-stat-card" style={{ padding: '1.8rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#ffffff' }}>
            <Upload size={20} style={{ color: 'var(--neon-cyan)' }} /> CARICA AVATAR CYBERWARE
          </h2>

          {uploadMessage && (
            <div className="alert alert-success">
              <CheckCircle2 size={18} /> <span>{uploadMessage}</span>
            </div>
          )}

          {uploadError && (
            <div className="alert alert-error">
              <AlertCircle size={18} /> <span>{uploadError}</span>
            </div>
          )}

          <form onSubmit={handleAvatarUpload}>
            <div className="form-group">
              <label className="form-label" style={{ fontFamily: 'var(--font-hud)', fontSize: '0.8rem' }}>SELEZIONA IMMAGINE (PNG, JPG, WEBP)</label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                style={{ background: '#050811' }}
                onChange={handleFileChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', marginTop: '0.6rem', padding: '0.75rem' }}
              disabled={!selectedFile || uploading}
            >
              {uploading ? 'CARICAMENTO...' : 'SALVA NUOVO AVATAR'}
            </button>
          </form>
        </div>

        {/* HUD Statistics Dashboard */}
        <div className="cyber-stat-card" style={{ padding: '1.8rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.4rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#ffffff' }}>
            <Trophy size={20} style={{ color: 'var(--neon-gold)' }} /> STATISTICHE UTENTE HUD
          </h2>

          {loading ? (
            <div style={{ color: 'var(--text-muted)' }}>Caricamento statistiche...</div>
          ) : profileStats ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1.2rem', background: '#050811', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <Puzzle size={18} style={{ color: 'var(--neon-cyan)' }} /> ENIGMI CREATI
                </span>
                <strong style={{ fontSize: '1.4rem', color: 'var(--neon-cyan)', fontFamily: 'var(--font-hud)' }}>{riddlesCreated}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1.2rem', background: '#050811', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--neon-green)' }} /> ENIGMI RISOLTI
                </span>
                <strong style={{ fontSize: '1.4rem', color: 'var(--neon-green)', fontFamily: 'var(--font-hud)' }}>{riddlesSolved}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1.2rem', background: '#050811', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <History size={18} style={{ color: 'var(--neon-pink)' }} /> TENTATIVI MEDI
                </span>
                <strong style={{ fontSize: '1.4rem', color: 'var(--neon-pink)', fontFamily: 'var(--font-hud)' }}>
                  {avgAttempts ? Number(avgAttempts).toFixed(1) : '-'}
                </strong>
              </div>
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)' }}>Nessuna statistica disponibile.</div>
          )}
        </div>
      </div>
    </div>
  );
}
