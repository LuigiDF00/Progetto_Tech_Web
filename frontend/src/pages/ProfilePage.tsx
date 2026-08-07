import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { User, Upload, CheckCircle2, AlertCircle, Trophy, Puzzle, History } from 'lucide-react';
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
      setUploadMessage('Avatar caricato con successo!');
      
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
    return <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>Caricamento sessione utente...</div>;
  }

  if (!user) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1.5rem', maxWidth: '600px', margin: '0 auto' }}>
        <AlertCircle size={40} style={{ color: 'var(--accent-amber)', marginBottom: '1rem' }} />
        <h2>Accesso Richiesto</h2>
        <p style={{ color: 'var(--text-muted)' }}>Accedi per visualizzare e gestire il tuo profilo personale.</p>
      </div>
    );
  }

  const riddlesCreated = profileStats?.riddles_created ?? profileStats?.created_count ?? profileStats?.stats?.created_count ?? 0;
  const riddlesSolved = profileStats?.riddles_solved ?? profileStats?.solved_count ?? profileStats?.stats?.solved_count ?? 0;
  const avgAttempts = profileStats?.avg_attempts ?? profileStats?.stats?.avg_attempts;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            {previewUrl || (profileStats && profileStats.avatar_url) || user.avatar_url ? (
              <img
                src={previewUrl || (profileStats && profileStats.avatar_url) || user.avatar_url || ''}
                alt={user.username}
                className="avatar-img"
                style={{ width: '90px', height: '90px', borderWidth: '3px' }}
              />
            ) : (
              <div className="avatar-placeholder" style={{ width: '90px', height: '90px', fontSize: '2.5rem' }}>
                {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
          </div>

          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>
              {user.username}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>@{user.username} • {user.email}</p>
            <span className="badge badge-indigo" style={{ marginTop: '0.5rem' }}>Utente Registrato</span>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        {/* Upload Avatar Form */}
        <div className="glass-card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Upload size={20} style={{ color: 'var(--primary)' }} /> Carica Immagine Avatar
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
              <label className="form-label">Seleziona Immagine (PNG, JPG, WEBP)</label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={handleFileChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-sm"
              style={{ width: '100%', marginTop: '0.5rem' }}
              disabled={!selectedFile || uploading}
            >
              {uploading ? 'Caricamento in corso...' : 'Salva Nuovo Avatar'}
            </button>
          </form>
        </div>

        {/* Statistiche Personali */}
        <div className="glass-card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Trophy size={20} style={{ color: 'var(--accent-amber)' }} /> Le Tue Statistiche
          </h2>

          {loading ? (
            <div style={{ color: 'var(--text-muted)' }}>Caricamento statistiche...</div>
          ) : profileStats ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#090d16', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Puzzle size={16} /> Enigmi Creati
                </span>
                <strong style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>{riddlesCreated}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#090d16', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={16} /> Enigmi Risolti
                </span>
                <strong style={{ fontSize: '1.1rem', color: 'var(--accent-emerald)' }}>{riddlesSolved}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#090d16', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <History size={16} /> Tentativi Medi per Enigma
                </span>
                <strong style={{ fontSize: '1.1rem', color: 'var(--accent-cyan)' }}>
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
