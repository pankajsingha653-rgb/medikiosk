import { useState } from 'react';
import { Logo } from './Logo';
import {
  Globe,
  HelpCircle,
  Volume2,
  VolumeX,
  PhoneCall,
  Stethoscope,
  Users,
  Building2,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { LanguageCode } from '../../types';

export interface HeaderProps {
  activeRole?: 'patient' | 'physician' | 'admin';
  onSelectRole?: (role: 'patient' | 'physician' | 'admin') => void;
  kioskId?: string;
  currentLanguage?: LanguageCode;
  onLanguageChange?: (lang: LanguageCode) => void;
  onStaffLoginClick?: () => void;
  isKioskMode?: boolean;
  onToggleKiosk?: () => void;
  onHomeClick?: () => void;
  isSpeaking?: boolean;
  onToggleAudioHelp?: () => void;
}

export function Header({
  activeRole = 'patient',
  onSelectRole,
  kioskId = 'KIOSK-01',
  currentLanguage = 'en',
  onLanguageChange,
  isKioskMode = false,
  onHomeClick,
  isSpeaking = false,
  onToggleAudioHelp
}: HeaderProps) {
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const languages: { code: LanguageCode; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'bn', label: 'Bengali', native: 'বাংলা' },
    { code: 'ne', label: 'Nepali', native: 'नेपाली' }
  ];

  const currentLangObj = languages.find(l => l.code === currentLanguage) || languages[0];

  const handleSelectRoleFromMenu = (role: 'patient' | 'physician' | 'admin') => {
    if (onSelectRole) onSelectRole(role);
    setShowMobileMenu(false);
  };

  return (
    <>
      <header className="w-full bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo */}
          <div
            onClick={onHomeClick}
            className="cursor-pointer hover:opacity-90 transition-opacity py-1 flex items-center gap-2"
            title="Return to Welcome"
          >
            <Logo size="md" showTagline={!isKioskMode} />
            <span className="hidden xl:inline text-[11px] font-mono text-[#666666] bg-[#F3EEFC] px-1.5 py-0.5 rounded border border-[#6C3FC5]/20">
              {kioskId}
            </span>
          </div>

          {/* Desktop & Tablet Role Navigation Switcher */}
          {onSelectRole && (
            <nav
              aria-label="Role Switcher"
              className="hidden md:flex items-center bg-[#F3EEFC] p-1 rounded-lg border border-[#6C3FC5]/15 text-xs font-semibold"
            >
              <button
                type="button"
                onClick={() => onSelectRole('patient')}
                className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
                  activeRole === 'patient'
                    ? 'bg-[#6C3FC5] text-white shadow-xs'
                    : 'text-[#666666] hover:text-[#171717] hover:bg-white/60'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Patient Kiosk</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectRole('physician')}
                className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
                  activeRole === 'physician'
                    ? 'bg-[#6C3FC5] text-white shadow-xs'
                    : 'text-[#666666] hover:text-[#171717] hover:bg-white/60'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Physician OPD</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectRole('admin')}
                className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
                  activeRole === 'admin'
                    ? 'bg-[#6C3FC5] text-white shadow-xs'
                    : 'text-[#666666] hover:text-[#171717] hover:bg-white/60'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Admin & Triage</span>
              </button>
            </nav>
          )}

          {/* Right Navigation Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Audio narration button */}
            {onToggleAudioHelp && (
              <button
                type="button"
                onClick={onToggleAudioHelp}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md border transition-colors ${
                  isSpeaking
                    ? 'bg-[#6C3FC5] text-white border-[#6C3FC5]'
                    : 'bg-white text-[#666666] border-neutral-200 hover:bg-[#F3EEFC] hover:text-[#6C3FC5]'
                }`}
                title="Voice Narrator"
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#6C3FC5]" />}
                <span className="hidden lg:inline">{isSpeaking ? 'Mute Audio' : 'Audio Guide'}</span>
              </button>
            )}

            {/* Language Switcher */}
            {onLanguageChange && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowLangDropdown(!showLangDropdown)}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md border border-neutral-200 bg-white text-[#171717] hover:bg-[#F3EEFC] hover:border-[#6C3FC5]/30 transition-colors"
                  aria-expanded={showLangDropdown}
                >
                  <Globe className="w-4 h-4 text-[#6C3FC5]" />
                  <span>{currentLangObj.native}</span>
                </button>

                {showLangDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-1.5 z-50">
                    <div className="px-3 py-1 text-[11px] font-bold text-[#666666] uppercase tracking-wider border-b border-neutral-100">
                      Select Language
                    </div>
                    {languages.map(l => (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => {
                          onLanguageChange(l.code);
                          setShowLangDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs sm:text-sm flex items-center justify-between hover:bg-[#F3EEFC] transition-colors ${
                          currentLanguage === l.code ? 'font-bold text-[#6C3FC5] bg-[#F3EEFC]/60' : 'text-[#171717]'
                        }`}
                      >
                        <span>{l.native}</span>
                        <span className="text-xs text-[#666666] font-normal">{l.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Help Button */}
            <button
              type="button"
              onClick={() => setShowHelpModal(true)}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md border border-neutral-200 bg-white text-[#666666] hover:bg-[#F3EEFC] hover:text-[#6C3FC5] transition-colors"
              title="Hospital Help"
            >
              <HelpCircle className="w-4 h-4 text-[#6C3FC5]" />
              <span className="hidden sm:inline">Help</span>
            </button>

            {/* Mobile Menu Toggle Button */}
            {onSelectRole && (
              <button
                type="button"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 rounded-md text-[#171717] hover:bg-[#F3EEFC] hover:text-[#6C3FC5] border border-neutral-200 transition-colors"
                aria-label="Toggle navigation menu"
              >
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Dropdown Navigation Drawer */}
        {showMobileMenu && onSelectRole && (
          <div className="md:hidden border-t border-neutral-200 bg-white px-4 py-3 shadow-md space-y-2 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="text-[11px] font-bold text-[#666666] uppercase tracking-wider mb-1">
              Switch View / Role
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              <button
                type="button"
                onClick={() => handleSelectRoleFromMenu('patient')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-md text-sm font-semibold transition-colors ${
                  activeRole === 'patient'
                    ? 'bg-[#6C3FC5] text-white'
                    : 'bg-[#F3EEFC]/60 text-[#171717] hover:bg-[#F3EEFC]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Patient Kiosk</span>
                </span>
                {activeRole === 'patient' && <span className="text-xs">Active</span>}
              </button>

              <button
                type="button"
                onClick={() => handleSelectRoleFromMenu('physician')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-md text-sm font-semibold transition-colors ${
                  activeRole === 'physician'
                    ? 'bg-[#6C3FC5] text-white'
                    : 'bg-[#F3EEFC]/60 text-[#171717] hover:bg-[#F3EEFC]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4" />
                  <span>Physician OPD Workstation</span>
                </span>
                {activeRole === 'physician' && <span className="text-xs">Active</span>}
              </button>

              <button
                type="button"
                onClick={() => handleSelectRoleFromMenu('admin')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-md text-sm font-semibold transition-colors ${
                  activeRole === 'admin'
                    ? 'bg-[#6C3FC5] text-white'
                    : 'bg-[#F3EEFC]/60 text-[#171717] hover:bg-[#F3EEFC]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span>Admin & Triage Monitor</span>
                </span>
                {activeRole === 'admin' && <span className="text-xs">Active</span>}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-neutral-200">
            <div className="flex items-start justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#F3EEFC] flex items-center justify-center text-[#6C3FC5]">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#171717]">Hospital Kiosk Assistance</h3>
                  <p className="text-xs text-[#666666]">MediKiosk Help & Guidance</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="text-[#666666] hover:text-[#171717] text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 text-[#171717] text-sm leading-relaxed">
              <p className="font-semibold text-sm text-[#171717]">
                Need help? Ask a hospital staff member.
              </p>
              <p className="text-[#666666] text-xs sm:text-sm">
                Hospital 'Swasthya Mitras' and reception volunteers are stationed at the OPD entry gate to assist with voice input, translation, and uploading paper documents.
              </p>
              <div className="p-3 bg-[#F3EEFC] rounded-lg border border-[#6C3FC5]/20 flex items-center gap-3">
                <PhoneCall className="w-5 h-5 text-[#6C3FC5] flex-shrink-0" />
                <div>
                  <div className="text-xs text-[#666666] font-medium">OPD Triage Helpline</div>
                  <div className="text-sm font-bold text-[#171717]">+91 11 2658 8500 (Ext. 402)</div>
                </div>
              </div>
              <p className="text-xs text-[#666666]">
                Notice: MediKiosk is designed to assist clinical history intake. All collected information is verified by a qualified physician.
              </p>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="px-5 py-2 bg-[#6C3FC5] hover:bg-[#4B238C] text-white rounded-lg font-semibold text-xs sm:text-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
