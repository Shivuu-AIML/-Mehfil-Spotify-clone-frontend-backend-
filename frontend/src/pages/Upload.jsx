import { useState } from 'react';
import client from '../api/client';
import './Page.css';
import './ArtistForms.css';

export default function Upload() {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!file) {
      setError('Choose an audio file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);

    setSubmitting(true);
    try {
      await client.post('/music/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess(`"${title}" is live in the mehfil.`);
      setTitle('');
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="main-content">
      <div className="page-hero">
        <span className="page-hero-eyebrow">Artist tools</span>
        <h1 className="page-hero-title">Give a new track its first listen.</h1>
      </div>

      <div className="form-card">
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="title">Track title</label>
            <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="form-field">
            <label htmlFor="file">Audio file</label>
            <label htmlFor="file" className={`file-drop ${file ? 'file-drop--filled' : ''}`}>
              {file ? file.name : 'Click to choose an audio file'}
            </label>
            <input
              id="file"
              type="file"
              accept="audio/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              style={{ display: 'none' }}
              required
            />
          </div>

          <button className="auth-submit" type="submit" disabled={submitting}>
            {submitting ? 'Uploading…' : 'Upload track'}
          </button>
        </form>
      </div>
    </div>
  );
}
