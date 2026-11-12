import React, { useState } from 'react';
import { Send, Mail, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { getAccessToken } from '../../firebase';
import { useApp } from '../../context/AppContext';

export const AccountabilityEmailer: React.FC = () => {
  const { user, firebaseUser } = useApp();
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Default accountability template
  const generateTemplate = () => {
    return `Brother,\n\nHere is my Panther accountability report for today:\n\nLevel: ${user.pantherLevel}\nXP: ${user.xp}\nCurrent Streak: ${user.streak.current} days\nTrees Planted: ${user.treesPlanted}\n\nThe trail never ends. Let's keep moving.\n\n- ${user.fullName}`;
  };

  const handleSend = async () => {
    if (!recipient.trim()) {
      setErrorMsg('Please enter a recipient email.');
      setStatus('error');
      return;
    }

    const token = getAccessToken();
    if (!token) {
      setErrorMsg('No Google access token found. Please re-authenticate your account.');
      setStatus('error');
      return;
    }

    const confirmed = window.confirm(`Send accountability report to ${recipient}?`);
    if (!confirmed) return;

    setStatus('sending');
    setErrorMsg('');

    try {
      const emailContent = [
        `To: ${recipient}`,
        `Subject: BA Challenge: Panther Accountability Report`,
        `Content-Type: text/plain; charset=utf-8`,
        ``,
        message || generateTemplate()
      ].join('\r\n');

      const encodedEmail = btoa(unescape(encodeURIComponent(emailContent)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          raw: encodedEmail
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error?.message || 'Failed to send email');
      }

      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err: any) {
      console.error('Email send error:', err);
      setErrorMsg(err.message || 'An error occurred while sending the email.');
      setStatus('error');
    }
  };

  if (!firebaseUser) {
    return (
      <div className="bg-[#0b1c12] border border-[#1b3d28] rounded-2xl p-6 text-center">
        <Mail className="w-8 h-8 text-[#8ea496] mx-auto mb-3" />
        <h3 className="text-[#f5ebd7] font-semibold mb-2">Accountability Reports</h3>
        <p className="text-sm text-[#8ea496]">Sign in with your Google account to send your progress reports to your accountability partner via Gmail.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0b1c12] border border-[#1b3d28] rounded-2xl p-5 sm:p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-[#143321] p-2 rounded-xl">
          <Mail className="w-5 h-5 text-[var(--accent-main)]" />
        </div>
        <div>
          <h3 className="text-[#f5ebd7] font-semibold">Accountability Report</h3>
          <p className="text-xs text-[#8ea496]">Send your progress directly via Gmail</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#8ea496] mb-1.5 ml-1">Brother's Email</label>
          <input
            type="email"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="accountability@example.com"
            className="w-full bg-[#040805] border border-[#1b3d28] rounded-xl px-4 py-2.5 text-sm text-[#f5ebd7] focus:outline-none focus:border-[var(--accent-main)] transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#8ea496] mb-1.5 ml-1">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={generateTemplate()}
            rows={4}
            className="w-full bg-[#040805] border border-[#1b3d28] rounded-xl px-4 py-3 text-sm text-[#f5ebd7] focus:outline-none focus:border-[var(--accent-main)] transition-colors resize-none"
          />
        </div>

        {status === 'error' && (
          <div className="flex items-center space-x-2 text-red-400 text-xs bg-red-950/30 p-3 rounded-xl border border-red-900/50">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <button
          onClick={handleSend}
          disabled={status === 'sending' || status === 'success'}
          className="w-full py-3 rounded-xl bg-[var(--accent-main)] hover:bg-[var(--accent-hover)] text-[#09150e] font-bold text-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {status === 'sending' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Transmitting...</span>
            </>
          ) : status === 'success' ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Report Sent</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Send Report</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
