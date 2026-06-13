/**
 * VoiceButton — Bouton flottant pour activer l'assistant vocal
 * À insérer dans le Layout principal du Cockpit / jsinnovia.com
 */
import React, { useState } from 'react';
import { Mic } from 'lucide-react';
import VoiceAssistant from './VoiceAssistant';

export default function VoiceButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && <VoiceAssistant onClose={() => setOpen(false)} />}

      <button
        onClick={() => setOpen(!open)}
        title="Assistant vocal Julien AI"
        style={{
          position: 'fixed',
          bottom: 20,
          right: 80,
          zIndex: 9998,
          width: 52,
          height: 52,
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          background: open
            ? 'rgba(255,77,77,0.3)'
            : 'rgba(0,180,216,0.2)',
          color: open ? '#FF4D4D' : '#00B4D8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: open
            ? '0 0 16px rgba(255,77,77,0.4)'
            : '0 0 16px rgba(0,180,216,0.3)',
          backdropFilter: 'blur(8px)',
          transition: 'all 0.2s',
          border: `1px solid ${open ? 'rgba(255,77,77,0.3)' : 'rgba(0,180,216,0.25)'}`,
        }}>
        <Mic size={20} />
      </button>
    </>
  );
}
