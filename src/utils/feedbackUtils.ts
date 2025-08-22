import { Vibration, Platform } from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Sound from 'react-native-sound';
import { useEffect, useRef, useState, useCallback } from 'react';

// Types
interface FeedbackOptions {
  hapticType?:
    | 'impactLight'
    | 'impactMedium'
    | 'impactHeavy'
    | 'notificationSuccess'
    | 'notificationWarning'
    | 'notificationError';
  enableVibrateFallback?: boolean;
  ignoreAndroidSystemSettings?: boolean;
}

interface AudioOptions {
  soundFile?: string;
  volume?: number;
}

// Default options
const DEFAULT_HAPTIC_OPTIONS: FeedbackOptions = {
  hapticType: 'impactLight',
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

const DEFAULT_AUDIO_OPTIONS: AudioOptions = {
  soundFile: 'tap.mp3',
  volume: 1.0,
};

// Sound instance
let soundInstance: Sound | null = null;
let isInitialized = false;

/**
 * Initialize the feedback system
 */
export const initializeFeedback = (audioOptions: AudioOptions = DEFAULT_AUDIO_OPTIONS) => {
  if (isInitialized) return;

  try {
    // Set audio category for iOS
    Sound.setCategory('Playback');

    // Enable playback in silent mode for iOS
    Sound.setMode('Default');

    // Initialize sound
    const soundFile = audioOptions.soundFile || 'tap.mp3';

    soundInstance = new Sound(soundFile, Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.warn(`Failed to load sound file: ${soundFile}`, error);
        soundInstance = null;
      } else {
        // Set volume if provided
        if (audioOptions.volume !== undefined && soundInstance) {
          soundInstance.setVolume(audioOptions.volume);
        }

        // Set number of loops to 0 (play once)
        if (soundInstance) {
          soundInstance.setNumberOfLoops(0);
        }
      }
    });

    isInitialized = true;
  } catch (error) {
    console.warn('Failed to initialize feedback system:', error);
  }
};

/**
 * Cleanup the feedback system
 */
export const cleanupFeedback = () => {
  if (soundInstance) {
    soundInstance.release();
    soundInstance = null;
  }
  isInitialized = false;
};

/**
 * Trigger haptic feedback
 */
export const triggerHaptic = (options: FeedbackOptions = DEFAULT_HAPTIC_OPTIONS) => {
  try {
    const hapticOptions = {
      enableVibrateFallback: options.enableVibrateFallback ?? true,
      ignoreAndroidSystemSettings: options.ignoreAndroidSystemSettings ?? false,
    };

    ReactNativeHapticFeedback.trigger(options.hapticType || 'impactLight', hapticOptions);
  } catch (error) {
    console.warn('💥 Haptic feedback error:', error);
    // Fallback to basic vibration
    Vibration.vibrate(50);
  }
};

/**
 * Play sound effect
 */
export const playSound = (callback?: (success: boolean) => void) => {
  if (!soundInstance) {
    console.warn('🔇 Sound not initialized');
    callback?.(false);
    return;
  }

  try {
    // Check if sound is already playing and stop it
    if (soundInstance.isPlaying()) {
      soundInstance.stop();
    }

    // Reset to beginning
    soundInstance.setCurrentTime(0);

    soundInstance.play((success: boolean) => {
      if (success) {
      } else {
      }
      callback?.(success);
    });
  } catch (error) {
    console.warn('💥 Sound playback error:', error);
    callback?.(false);
  }
};

/**
 * Combined haptic and audio feedback
 */
export const triggerFeedback = (
  hapticOptions: FeedbackOptions = DEFAULT_HAPTIC_OPTIONS,
  playAudio: boolean = true,
  audioCallback?: (success: boolean) => void,
) => {
  // Trigger haptic feedback
  triggerHaptic(hapticOptions);

  // Play audio if requested
  if (playAudio) {
    playSound(audioCallback);
  }
};

/**
 * React Hook for feedback functionality
 */
export const useFeedback = (audioEnabled: boolean = true) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(audioEnabled);

  // Initialize feedback system on mount
  useEffect(() => {
    initializeFeedback();

    // Cleanup on unmount
    return () => {
      cleanupFeedback();
    };
  }, []);

  // Toggle audio feedback
  const toggleAudio = useCallback(() => {
    setIsAudioEnabled(prev => !prev);
  }, []);

  // Trigger feedback with current settings
  const trigger = useCallback(
    (
      hapticOptions: FeedbackOptions = DEFAULT_HAPTIC_OPTIONS,
      audioCallback?: (success: boolean) => void,
    ) => {
      triggerFeedback(hapticOptions, isAudioEnabled, audioCallback);
    },
    [isAudioEnabled],
  );

  return {
    trigger,
    toggleAudio,
    isAudioEnabled,
    triggerHaptic,
    playSound,
  };
};

// Predefined feedback types
export const FeedbackTypes = {
  // Light feedback for taps
  tap: () => {
    triggerFeedback({ hapticType: 'impactLight' });
  },

  // Medium feedback for selections
  select: () => {
    triggerFeedback({ hapticType: 'impactMedium' });
  },

  // Heavy feedback for important actions
  action: () => {
    triggerFeedback({ hapticType: 'impactHeavy' });
  },

  // Success feedback
  success: () => {
    triggerFeedback({ hapticType: 'notificationSuccess' });
  },

  // Warning feedback
  warning: () => {
    triggerFeedback({ hapticType: 'notificationWarning' });
  },

  // Error feedback
  error: () => {
    triggerFeedback({ hapticType: 'notificationError' });
  },

  // Haptic only (no sound)
  hapticOnly: (type: FeedbackOptions['hapticType'] = 'impactLight') => {
    triggerFeedback({ hapticType: type }, false);
  },

  // Sound only (no haptic)
  soundOnly: () => {
    triggerFeedback({}, true);
  },
};

// Utility functions for managing strikethrough state with API data
export const StrikethroughUtils = {
  /**
   * Initialize strikethrough state for items from API
   */
  initializeStrikethroughState: (items: any[]) => {
    return items.map(item => ({
      ...item,
      isStruckThrough: item.isStruckThrough || false,
    }));
  },

  /**
   * Update strikethrough state for a specific item
   */
  updateItemStrikethrough: (items: any[], itemId: string, isStruckThrough: boolean) => {
    return items.map(item =>
      item.receiptId === itemId || item.id === itemId ? { ...item, isStruckThrough } : item,
    );
  },

  /**
   * Get items with strikethrough state
   */
  getStruckThroughItems: (items: any[]) => {
    return items.filter(item => item.isStruckThrough);
  },

  /**
   * Get items without strikethrough state
   */
  getNonStruckThroughItems: (items: any[]) => {
    return items.filter(item => !item.isStruckThrough);
  },

  /**
   * Reset all strikethrough states
   */
  resetAllStrikethrough: (items: any[]) => {
    return items.map(item => ({ ...item, isStruckThrough: false }));
  },

  /**
   * Sync strikethrough state with API data (useful when data is refreshed)
   */
  syncStrikethroughWithAPI: (apiItems: any[], currentItems: any[]) => {
    return apiItems.map(apiItem => {
      const currentItem = currentItems.find(
        item => item.receiptId === apiItem.receiptId || item.id === apiItem.id,
      );
      return {
        ...apiItem,
        isStruckThrough: currentItem?.isStruckThrough || false,
      };
    });
  },
};
