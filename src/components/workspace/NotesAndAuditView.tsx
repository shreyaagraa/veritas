/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuditLogEntry } from '../../types/investigation';
import { FileText, Send, User, Shield, CheckCircle2 } from 'lucide-react';

interface NotesAndAuditViewProps {
  investigationId: string;
  notes: Array<{ id: string; author: string; timestamp: string; text: string }>;
  auditLogs: AuditLogEntry[];
  onAddNote: (text: string, author: string) => void;
}

export const NotesAndAuditView: React.FC<NotesAndAuditViewProps> = ({
  investigationId,
  notes,
  auditLogs,
  onAddNote,
}) => {
  const [newNoteText, setNewNoteText] = useState('');
  const [authorName, setAuthorName] = useState('Lead Investigator');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    onAddNote(newNoteText.trim(), authorName);
    setNewNoteText('');
  };

  return (
    <div className="h-full bg-slate-900 text-slate-100 p-4 overflow-y-auto text-xs">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notes Column */}
        <div className="space-y-4">
          <div className="pb-2 border-b border-slate-800">
            <h4 className="font-semibold text-sm text-slate-100 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-cyan-400" />
              Case Notes & Investigative Hypotheses
            </h4>
            <p className="text-slate-400 text-xs">
              Observations and actionable leads appended by authorized analysts.
            </p>
          </div>

          {/* Add Note Form */}
          <form onSubmit={handleSubmit} className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Add Log Entry</span>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Author name/unit"
                className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-[11px] text-slate-300 w-44"
              />
            </div>
            <textarea
              rows={3}
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Record investigative lead, subpoena status, or cluster hypothesis..."
              className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!newNoteText.trim()}
                className="flex items-center gap-1 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded font-medium transition-colors"
              >
                <Send className="w-3 h-3" />
                Append Note
              </button>
            </div>
          </form>

          {/* Notes List */}
          <div className="space-y-2.5">
            {notes.map((note) => (
              <div key={note.id} className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-200 flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" />
                    {note.author}
                  </span>
                  <span className="font-mono text-slate-400">
                    {new Date(note.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">{note.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Trail Column */}
        <div className="space-y-4">
          <div className="pb-2 border-b border-slate-800">
            <h4 className="font-semibold text-sm text-slate-100 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400" />
              Chain of Custody & Forensic Audit Trail
            </h4>
            <p className="text-slate-400 text-xs">
              Tamper-evident system log tracking analysis steps, evidence verification, and reporting actions.
            </p>
          </div>

          <div className="space-y-2 font-mono text-[11px]">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-2.5 bg-slate-950/70 border border-slate-800/80 rounded space-y-1"
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-semibold">
                    {log.action}
                  </span>
                  <span className="text-slate-500 font-sans">
                    {new Date(log.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </span>
                </div>
                <div className="text-slate-300 font-sans text-xs">{log.details}</div>
                <div className="text-slate-500 text-[10px]">Actor: {log.actor}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
