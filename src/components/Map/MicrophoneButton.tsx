'use client';

import { useRecordVoice } from '@/hooks/useRecordVoice';
import { Tooltip } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { PiMicrophoneBold } from 'react-icons/pi';
import { LongPressEventType, useLongPress } from 'use-long-press';

interface MicrophoneProps {
  sendMessage: (input: string) => Promise<void>;
}

export const MicrophoneButton = ({ sendMessage }: MicrophoneProps) => {
  const { isRecording, startRecording, stopRecording, text } = useRecordVoice();
  const [isEnterPressed, setIsEnterPressed] = useState(false);
  const enterPressTimeout = useRef<NodeJS.Timeout | null>(null);
  const [loading, setLoading] = useState(false);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !isEnterPressed) {
      enterPressTimeout.current = setTimeout(() => {
        if (!isRecording.current) {
          startRecording();
          setIsEnterPressed(true);
        }
      }, 1000); // 500ms threshold for long press
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      if (enterPressTimeout.current) {
        clearTimeout(enterPressTimeout.current);
        enterPressTimeout.current = null;
      }
      if (isEnterPressed) {
        stopRecording();
        setIsEnterPressed(false);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isRecording, startRecording, stopRecording]);

  const callback = () => {
    console.log('long press start');
    startRecording();
    setLoading(true);
  };

  const bind = useLongPress(callback, {
    onStart: (event, meta) => {
      console.log('Press started', meta);
    },
    onFinish: (event, meta) => {
      stopRecording();
      setLoading(false);
      console.log('Long press finished', meta);
    },
    filterEvents: (event) => true, // All events can potentially trigger long press
    threshold: 1000,
    captureEvent: true,
    cancelOnMovement: false,
    cancelOutsideElement: true,
    detect: LongPressEventType.Pointer,
  });
  const handlers = bind('test context');

  useEffect(() => {
    if (text) {
      const input = text.trim();
      // rajouter le message dans l'historique de chat ai/react car input vide avec sendMessage
      // append({ role: 'user', content: input, createdAt: new Date(), id: uuidv4() });
      sendMessage(text);
    }
  }, [text]);

  return (
    <Tooltip
      title="Restez appuyé sur l'icone ou sur la touche entrer pour enregistrer"
      placement="top"
      enterDelay={300}>
      <button
        {...handlers}
        className={`size-8 ${
          isRecording.current || loading ? 'bg-red-600 transition animate-pulse duration-1000' : 'bg-base-300'
        } flex ease-in-out transition hover:bg-opacity-90 items-center justify-center rounded-full shadow-sm cursor-pointer`}
        tabIndex={0}>
        <PiMicrophoneBold color="white" size={20} />
      </button>
    </Tooltip>
  );
};
