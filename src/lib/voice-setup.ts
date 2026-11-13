const VOICE_SETUP_COMPLETE_KEY = "voice-setup-complete";

export const hasCompletedVoiceSetup = () =>
  window.localStorage.getItem(VOICE_SETUP_COMPLETE_KEY) === "true";

export const markVoiceSetupComplete = () => {
  window.localStorage.setItem(VOICE_SETUP_COMPLETE_KEY, "true");
};