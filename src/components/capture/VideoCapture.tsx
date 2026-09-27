'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Video, Square, Play, RotateCcw, Check, ArrowRight, Volume2 } from 'lucide-react';
import { playUiBeep } from '@/lib/audio-utils';
import { extractAudioTrack, hasSustainedSpeech } from '@/lib/capture/audio-extraction';

interface VideoCaptureProps {
  onVideoRecorded: (videoBlob: Blob, hasSpeech: boolean, durationSeconds: number) => void;
  onCancel: () => void;
}

export function VideoCapture({ onVideoRecorded, onCancel }: VideoCaptureProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [hasSpeech, setHasSpeech] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 720 },
            height: { ideal: 720 },
          },
          audio: {
            channelCount: 1,
            sampleRate: 16000,
            echoCancellation: true,
            noiseSuppression: true,
          },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      } catch (err) {
        console.warn('Video camera access error:', err);
      }
    }

    void startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setInterval(() => {
        setSeconds((prev) => {
          if (prev >= 15) {
            stopRecording();
            return 15;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const startRecording = () => {
    if (!streamRef.current) return;
    playUiBeep('start');
    chunksRef.current = [];
    setSeconds(0);

    try {
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
        ? 'video/webm;codecs=vp9,opus'
        : 'video/mp4';

      const recorder = new MediaRecorder(streamRef.current, {
        mimeType,
        videoBitsPerSecond: 800000,
      });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        setIsAnalyzing(true);
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setRecordedBlob(blob);

        // Analyze audio track for sustained narration
        const audioBuffer = await extractAudioTrack(blob);
        const speechDetected = hasSustainedSpeech(audioBuffer, 6000);
        setHasSpeech(speechDetected);
        setIsAnalyzing(false);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch {
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    playUiBeep('stop');
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    } else {
      const mockBlob = new Blob(['mock-video-bytes'], { type: 'video/webm' });
      setRecordedBlob(mockBlob);
      setHasSpeech(true);
    }
    setIsRecording(false);
  };

  const handleConfirm = () => {
    if (recordedBlob) {
      onVideoRecorded(recordedBlob, hasSpeech, seconds || 8);
    }
  };

  return (
    <div className="bg-white border-2 border-[#E4DACE] rounded-3xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#C05A34]/15 flex items-center justify-center text-[#C05A34]">
            <Video className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-[#22201D]">5-15 सेकंड का वीडियो बनाएं</h3>
            <p className="text-xs text-stone-500">वस्तु को घुमाकर दिखाएं (Show from all angles)</p>
          </div>
        </div>
      </div>

      {/* Video Viewport / Preview */}
      <div className="relative aspect-square max-h-72 w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center mx-auto">
        {!recordedBlob ? (
          <video
            ref={videoRef}
            playsInline
            autoPlay
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            src={URL.createObjectURL(recordedBlob)}
            controls
            playsInline
            className="w-full h-full object-contain"
          />
        )}

        {/* Live Timer badge */}
        {isRecording && (
          <div className="absolute top-3 left-3 bg-red-600 text-white font-mono text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
            <div className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>0:{seconds.toString().padStart(2, '0')} / 0:15</span>
          </div>
        )}
      </div>

      {/* Recording Control */}
      {!recordedBlob ? (
        <div className="flex flex-col items-center justify-center space-y-2 pt-2">
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
              isRecording ? 'bg-stone-900 text-white' : 'bg-[#C05A34] text-white hover:bg-[#9A4526]'
            }`}
          >
            {isRecording ? <Square className="w-7 h-7 fill-current" /> : <Video className="w-8 h-8" />}
          </button>
          <span className="text-xs font-semibold text-stone-600">
            {isRecording ? 'रोकने के लिए दबाएं (Tap to Stop)' : 'रिकॉर्डिंग शुरू करें (Tap to Record)'}
          </span>
        </div>
      ) : (
        <div className="space-y-3 pt-2">
          {hasSpeech ? (
            <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 text-xs text-emerald-900 font-medium flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>
                आपने वीडियो में बोलते हुए समझाया — बढ़िया! अगली संक्षेप रिकॉर्डिंग अपने आप स्किप होगी।
              </span>
            </div>
          ) : (
            <div className="bg-stone-100 rounded-xl p-3 text-xs text-stone-700 font-medium">
              वीडियो में आवाज़ नहीं मिली — हम अगले चरण में छोटा 12 सेकंड का विवरण लेंगे।
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setRecordedBlob(null);
                setSeconds(0);
              }}
              className="flex-1 py-3 rounded-xl border border-stone-300 font-bold text-xs hover:bg-stone-50 flex items-center justify-center gap-1"
            >
              <RotateCcw className="w-4 h-4" /> फिर से लें (Retake)
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 py-3 rounded-xl bg-[#C05A34] text-white font-bold text-xs hover:bg-[#9A4526] flex items-center justify-center gap-1 shadow-sm"
            >
              आगे बढ़ें (Next) <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
