import React from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useVirtualGuide } from './useVirtualGuide';
import { SpeechBubble } from './SpeechBubble';
import { GuideButton } from './GuideButton';

export function GuideController() {
  const {
    user,
    lang,
    visible,
    minimized,
    isSpeaking,
    isTyping,
    activeSpeechText,
    activeTab,
    greetingPayload,
    isMuted,
    guideEnabled,
    show,
    hide,
    minimize,
    handleGotIt,
    handleActionClick,
    toggleMute,
    replayIntro
  } = useVirtualGuide();

  if (!visible || !user || !guideEnabled) return null;

  const content = (
    <div 
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 99999,
        pointerEvents: 'none'
      }}
    >
      <AnimatePresence mode="wait">
        {minimized ? (
          <motion.div
            key="minimized-button"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{ pointerEvents: 'auto' }}
          >
            <GuideButton onClick={show} lang={lang} />
          </motion.div>
        ) : (
          <motion.div
            key="expanded-card"
            initial={{ y: 30, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ pointerEvents: 'auto' }}
          >
            <SpeechBubble 
              user={user}
              lang={lang}
              activeSpeechText={activeSpeechText}
              activeTab={activeTab}
              greetingPayload={greetingPayload}
              isSpeaking={isSpeaking}
              isMuted={isMuted}
              isTyping={isTyping}
              onClose={hide}
              onMinimize={minimize}
              onToggleMute={toggleMute}
              onReplay={replayIntro}
              onGotIt={handleGotIt}
              onActionClick={handleActionClick}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // Render assistant portal into document.body outside dashboard layout
  return ReactDOM.createPortal(content, document.body);
}
