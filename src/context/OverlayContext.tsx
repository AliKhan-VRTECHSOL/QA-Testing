import React, { createContext, useContext, useState, useMemo, ReactNode, useEffect } from 'react';
import { ViewStyle, BackHandler } from 'react-native';
import LoadingScreen from '../components/LoadingScreen';
import AnnounceMent from '../components/Announcement';
import FadeInView from '../components/FadeInView';
import AlertComponent from '../components/AlertComponent';

export interface AlertConfig {
  heading: string;
  description: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  showContinueButton?: boolean;
  showCancelButton?: boolean;
  showOKButton?: boolean;
  continueButtonText?: string;
  cancelButtonText?: string;
  okButtonText?: string;
  onContinue?: () => void;
  onCancel?: () => void;
  onOK?: () => void;
}

export interface OverlayContextType {
  showLoading: boolean;
  progress: number;
  showAnnouncement: boolean;
  announcementMessage: string;
  alert: AlertConfig | null;
  setShowLoading: (value: boolean) => void;
  setProgress: (value: number) => void;
  setShowAnnouncement: (value: boolean) => void;
  setAnnouncementMessage: (msg: string) => void;
  setFadeInViewStyle: (viewStyle: ViewStyle) => void;
  setFadeInViewVisible: (value: boolean) => void;
  setFadeInViewContent: (content: ReactNode) => void;
  setOnPressAcknowledgeButtonFunction: (fn: () => void) => void;
  showAlert: (config: AlertConfig) => void;
  hideAlert: () => void;
  setCustomBackHandler: (handler: (() => boolean) | null) => void;
}

const OverlayContext = createContext<OverlayContextType | undefined>(undefined);

interface OverlayProviderProps {
  children: ReactNode;
}

export const OverlayProvider: React.FC<OverlayProviderProps> = ({ children }) => {
  const [showLoading, setShowLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [announcementMessage, setAnnouncementMessage] = useState('');
  const [fadeInViewStyle, setFadeInViewStyle] = useState<ViewStyle>({});
  const [fadeInViewVisible, setFadeInViewVisible] = useState(false);
  const [fadeInViewContent, setFadeInViewContent] = useState<ReactNode>(null);
  const [onPressAcknowledgeButton, setOnPressAcknowledgeButton] = useState<() => void>(() => {});

  // Alert state
  const [alert, setAlert] = useState<AlertConfig | null>(null);

  // Custom back handler
  const [customBackHandler, setCustomBackHandler] = useState<(() => boolean) | null>(null);

  // Back button handling
  useEffect(() => {
    const backAction = () => {
      // Check if any overlay is visible
      const hasVisibleOverlay =
        showLoading || showAnnouncement || fadeInViewVisible || alert !== null;

      if (!hasVisibleOverlay) {
        return false; // Let default back behavior happen
      }

      // If custom handler is provided, use it
      if (customBackHandler) {
        return customBackHandler();
      }

      // Default behavior for each overlay type
      if (alert !== null) {
        setAlert(null);
        return true;
      }

      if (showAnnouncement) {
        setShowAnnouncement(false);
        if (onPressAcknowledgeButton) {
          onPressAcknowledgeButton();
        }
        return true;
      }

      if (fadeInViewVisible) {
        setFadeInViewVisible(false);
        return true;
      }

      if (showLoading) {
        setShowLoading(false);
        return true;
      }

      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [
    showLoading,
    showAnnouncement,
    fadeInViewVisible,
    alert,
    customBackHandler,
    onPressAcknowledgeButton,
  ]);

  const showAlert = (config: AlertConfig) => {
    setAlert(config);
  };

  const hideAlert = () => {
    setAlert(null);
  };

  const value = useMemo(
    () => ({
      showLoading,
      progress,
      showAnnouncement,
      announcementMessage,
      alert,
      setShowLoading,
      setProgress,
      setShowAnnouncement,
      setAnnouncementMessage,
      setFadeInViewStyle,
      setFadeInViewVisible,
      setFadeInViewContent,
      setOnPressAcknowledgeButtonFunction: setOnPressAcknowledgeButton,
      showAlert,
      hideAlert,
      setCustomBackHandler,
    }),
    [
      showLoading,
      progress,
      showAnnouncement,
      announcementMessage,
      alert,
      setFadeInViewStyle,
      setFadeInViewVisible,
      setFadeInViewContent,
    ],
  );

  return (
    <OverlayContext.Provider value={value}>
      {children}
      <AnnounceMent
        isVisible={showAnnouncement}
        message={announcementMessage}
        onAcknowledge={onPressAcknowledgeButton}
      />
      <FadeInView style={fadeInViewStyle} isVisible={fadeInViewVisible}>
        {fadeInViewContent}
      </FadeInView>
      <LoadingScreen isVisible={showLoading} progress={progress} />
      {alert && (
        <AlertComponent
          isVisible={true}
          heading={alert.heading}
          description={alert.description}
          type={alert.type || 'info'}
          showContinueButton={alert.showContinueButton || false}
          showCancelButton={alert.showCancelButton || false}
          showOKButton={alert.showOKButton !== false}
          continueButtonText={alert.continueButtonText || 'Continue'}
          cancelButtonText={alert.cancelButtonText || 'Cancel'}
          okButtonText={alert.okButtonText || 'OK'}
          onContinue={alert.onContinue}
          onCancel={alert.onCancel}
          onOK={alert.onOK}
          onBackdropPress={hideAlert}
        />
      )}
    </OverlayContext.Provider>
  );
};

export const useOverlay = (): OverlayContextType => {
  const context = useContext(OverlayContext);
  if (!context) {
    throw new Error('useOverlay must be used within an OverlayProvider');
  }
  return context;
};
