import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Trash2, Volume2, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const VoiceRecorder = ({ onAudioRecorded, onAudioCleared }) => {
  const { t, language } = useLanguage();
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioPlayerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        if (onAudioRecorded) {
          onAudioRecorded(blob);
        }
        // Stop all audio tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setRecordSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordSeconds(prev => {
          if (prev >= 60) {
            stopRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error('Microphone access denied:', err);
      alert('Microphone permission required for voice notes. Please allow microphone access in your browser.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const clearAudio = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setAudioBlob(null);
    setRecordSeconds(0);
    if (onAudioCleared) onAudioCleared();
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  return (
    <div className="bg-surface-muted rounded-xl p-4 border border-surface-border">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-dark-900 flex items-center space-x-1.5">
          <Volume2 className="w-3.5 h-3.5 text-brand-600" />
          <span>{t('describe_voice')}</span>
        </span>
        <span className="text-[11px] text-dark-500 font-medium">
          {language === 'kh' ? 'खोरठा बोली समर्थित' : language === 'hi' ? 'हिन्दी आवाज समर्थित' : 'Supports Vernacular Audio'}
        </span>
      </div>

      {!audioUrl && !isRecording && (
        <button
          type="button"
          onClick={startRecording}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border border-brand-200 bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold transition shadow-clean"
        >
          <Mic className="w-4 h-4 text-brand-600" />
          <span>{t('record_voice')} (Tap to Speak)</span>
        </button>
      )}

      {isRecording && (
        <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-200 animate-pulse">
          <div className="flex items-center space-x-3">
            <span className="w-3 h-3 rounded-full bg-red-600 animate-ping" />
            <span className="text-xs font-bold text-red-800">
              Recording... {formatTime(recordSeconds)} / 1:00
            </span>
          </div>
          <button
            type="button"
            onClick={stopRecording}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>{t('stop_recording')}</span>
          </button>
        </div>
      )}

      {audioUrl && !isRecording && (
        <div className="flex flex-col sm:flex-row items-center justify-between p-3 bg-white rounded-xl border border-surface-border gap-2">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <audio ref={audioPlayerRef} src={audioUrl} controls className="h-8 max-w-full" />
          </div>
          <button
            type="button"
            onClick={clearAudio}
            className="flex items-center space-x-1 text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50 transition"
            title="Delete Audio"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Discard</span>
          </button>
        </div>
      )}
    </div>
  );
};
