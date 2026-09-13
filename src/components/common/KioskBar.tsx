import { Volume2, VolumeX, AlertTriangle, PhoneCall } from 'lucide-react';
import { AccessibilitySettings } from '../../types';
import { AudioService } from '../../services/ai';

export interface KioskBarProps {
  settings?: AccessibilitySettings;
  onSettingsChange?: (settings: AccessibilitySettings) => void;
  fontSize?: 'normal' | 'large' | 'xl';
  onFontSizeChange?: (size: 'normal' | 'large' | 'xl') => void;
  highContrast?: boolean;
  onToggleHighContrast?: () => void;
  isSpeaking?: boolean;
  onToggleSpeech?: () => void;
  onEmergencyCall?: () => void;
}

export function KioskBar({
  settings,
  onSettingsChange,
  fontSize = 'normal',
  onFontSizeChange,
  highContrast = false,
  onToggleHighContrast,
  isSpeaking = false,
  onToggleSpeech,
  onEmergencyCall
}: KioskBarProps) {
  const currentHighContrast = settings ? settings.highContrast : highContrast;
  const currentTextSize = settings ? settings.textSize : fontSize;
  const currentSpeaking = settings ? settings.audioAssistance : isSpeaking;

  const handleToggleContrast = () => {
    if (settings && onSettingsChange) {
      onSettingsChange({ ...settings, highContrast: !settings.highContrast });
    } else if (onToggleHighContrast) {
      onToggleHighContrast();
    }
  };

  const handleTextSize = (size: 'normal' | 'large' | 'extra-large' | 'xl') => {
    const mapped: 'normal' | 'large' | 'extra-large' = size === 'xl' ? 'extra-large' : size;
    if (settings && onSettingsChange) {
      onSettingsChange({ ...settings, textSize: mapped });
    } else if (onFontSizeChange) {
      onFontSizeChange(size === 'extra-large' ? 'xl' : size);
    }
  };

  const handleToggleVoice = () => {
    if (settings && onSettingsChange) {
      const next = !settings.audioAssistance;
      if (!next) AudioService.stopSpeaking();
      onSettingsChange({ ...settings, audioAssistance: next });
    } else if (onToggleSpeech) {
      onToggleSpeech();
    }
  };

  const handleEmergency = () => {
    if (onEmergencyCall) {
      onEmergencyCall();
    } else {
      alert('Alert transmitted to Hospital OPD Triage & Emergency Nursing Station. Counter assistance dispatched.');
    }
  };

  return (
    <div
      className={`w-full border-b py-2 px-3 sm:px-6 transition-colors ${
        currentHighContrast
          ? 'bg-black text-white border-neutral-800'
          : 'bg-[#F3EEFC]/50 text-[#171717] border-neutral-200'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5 text-xs">
        {/* Left: Triage Emergency Safety Note */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1 font-bold text-[#4B238C] uppercase tracking-wide text-[11px] sm:text-xs">
            <AlertTriangle className="w-3.5 h-3.5 text-[#6C3FC5]" />
            Emergency Protocol:
          </span>
          <span className="hidden md:inline text-[#666666]">
            For sudden severe distress or altered consciousness, notify triage staff immediately.
          </span>
          <button
            type="button"
            onClick={handleEmergency}
            className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-white bg-[#4B238C] hover:bg-[#6C3FC5] px-2.5 py-1 rounded shadow-xs transition-colors"
          >
            <PhoneCall className="w-3 h-3" />
            <span>Alert Triage Nurse</span>
          </button>
        </div>

        {/* Right: Accessibility Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Text Size Controls */}
          <div className="flex items-center gap-1 bg-white border border-neutral-200 rounded px-1.5 py-0.5 text-[#171717]">
            <span className="text-[11px] font-semibold mr-1 text-[#666666]">Font:</span>
            <button
              type="button"
              onClick={() => handleTextSize('normal')}
              className={`px-1.5 py-0.5 rounded text-xs transition-colors ${
                currentTextSize === 'normal' ? 'bg-[#6C3FC5] text-white font-bold' : 'hover:bg-[#F3EEFC] text-[#666666]'
              }`}
              title="Standard Font Size"
            >
              A
            </button>
            <button
              type="button"
              onClick={() => handleTextSize('large')}
              className={`px-1.5 py-0.5 rounded text-xs transition-colors ${
                currentTextSize === 'large' ? 'bg-[#6C3FC5] text-white font-bold' : 'hover:bg-[#F3EEFC] text-[#666666]'
              }`}
              title="Large Font Size"
            >
              A+
            </button>
            <button
              type="button"
              onClick={() => handleTextSize('extra-large')}
              className={`px-1.5 py-0.5 rounded text-xs font-bold transition-colors ${
                currentTextSize === 'extra-large' || currentTextSize === 'xl'
                  ? 'bg-[#6C3FC5] text-white'
                  : 'hover:bg-[#F3EEFC] text-[#666666]'
              }`}
              title="Extra Large Font Size"
            >
              A++
            </button>
          </div>

          {/* High Contrast Toggle */}
          <button
            type="button"
            onClick={handleToggleContrast}
            className={`px-2 py-1 rounded text-xs font-medium border transition-colors ${
              currentHighContrast
                ? 'bg-white text-black border-white'
                : 'bg-white text-[#666666] border-neutral-200 hover:bg-[#F3EEFC] hover:text-[#6C3FC5]'
            }`}
          >
            {currentHighContrast ? 'Standard' : 'Contrast'}
          </button>

          {/* Voice Narrator */}
          <button
            type="button"
            onClick={handleToggleVoice}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
              currentSpeaking
                ? 'bg-[#6C3FC5] text-white border-[#6C3FC5]'
                : 'bg-white text-[#666666] border-neutral-200 hover:bg-[#F3EEFC] hover:text-[#6C3FC5]'
            }`}
          >
            {currentSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#6C3FC5]" />}
            <span>{currentSpeaking ? 'Voice: On' : 'Audio'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
