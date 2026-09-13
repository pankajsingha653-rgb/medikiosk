import { Volume2, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { LanguageCode } from '../../types';
import { AudioService } from '../../services/ai';

export interface LanguageViewProps {
  selectedLanguage?: LanguageCode;
  currentLanguage?: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function LanguageView({
  selectedLanguage,
  currentLanguage,
  onSelectLanguage,
  onContinue,
  onBack
}: LanguageViewProps) {
  const activeLang = currentLanguage || selectedLanguage || 'hi';
  const languages: {
    code: LanguageCode;
    name: string;
    nativeName: string;
    description: string;
    samplePhrase: string;
  }[] = [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      description: 'Medical terms in simple conversational English',
      samplePhrase: 'Welcome to MediKiosk. Please select English to continue.'
    },
    {
      code: 'hi',
      name: 'Hindi',
      nativeName: 'हिन्दी',
      description: 'सरल हिन्दी में अपनी स्वास्थ्य जानकारी दर्ज करें',
      samplePhrase: 'मेडीकियोस्क में आपका स्वागत है। आगे बढ़ने के लिए हिन्दी चुनें।'
    },
    {
      code: 'bn',
      name: 'Bengali',
      nativeName: 'বাংলা',
      description: 'সহজ বাংলায় আপনার লক্ষণ ও ইতিহাস নথিভুক্ত করুন',
      samplePhrase: 'মেডিকিয়স্কে স্বাগতম। এগিয়ে যেতে বাংলা নির্বাচন করুন।'
    },
    {
      code: 'ne',
      name: 'Nepali',
      nativeName: 'नेपाली',
      description: 'सजिलो नेपाली भाषामा आफ्नो स्वास्थ्य विवरण भर्नुहोस्',
      samplePhrase: 'मेडीकियोस्कमा स्वागत छ। जारी राख्न नेपाली रोज्नुहोस्।'
    }
  ];

  const handlePlayAudio = (e: { stopPropagation: () => void }, phrase: string, lang: LanguageCode) => {
    e.stopPropagation();
    AudioService.speak(phrase, lang);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8">
      {/* Progress Bar (Step 1 of 5) */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between text-xs font-semibold text-[#666666] mb-2">
          <span className="text-[#6C3FC5] font-bold">Step 1 of 5: Language Selection</span>
          <span>Estimated total time: 8–12 minutes</span>
        </div>
        <div className="w-full bg-[#F3EEFC] h-2 rounded-full overflow-hidden">
          <div className="bg-[#6C3FC5] h-full rounded-full transition-all duration-300 w-[20%]" />
        </div>
      </div>

      {/* Screen Header */}
      <div className="text-center space-y-2 mb-6 sm:mb-8">
        <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#171717] tracking-tight">
          Choose your preferred language
        </h2>
        <p className="text-xs sm:text-sm text-[#666666]">
          अपनी पसंदीदा भाषा चुनें • আপনার পছন্দের ভাষা বেছে নিন • आफ्नो मनपर्ने भाषा रोज्नुहोस्
        </p>
      </div>

      {/* Large Touch Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {languages.map(lang => {
          const isSelected = activeLang === lang.code;
          return (
            <div
              key={lang.code}
              onClick={() => onSelectLanguage(lang.code)}
              className={`p-5 sm:p-6 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between min-h-[130px] sm:min-h-[140px] select-none ${
                isSelected
                  ? 'border-[#6C3FC5] bg-[#F3EEFC]/60 shadow-xs ring-1 ring-[#6C3FC5]'
                  : 'border-neutral-200 bg-white hover:border-[#6C3FC5]/40 hover:bg-[#F3EEFC]/20'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#171717] mb-1">
                    {lang.nativeName}
                  </div>
                  <div className="text-sm font-medium text-[#666666]">{lang.name}</div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Speaker Audio Preview Icon */}
                  <button
                    type="button"
                    onClick={e => handlePlayAudio(e, lang.samplePhrase, lang.code)}
                    className="w-10 h-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-[#666666] hover:text-[#6C3FC5] hover:border-[#6C3FC5] hover:bg-[#F3EEFC] transition-colors"
                    title={`Listen in ${lang.name}`}
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>

                  {/* Selected Radio Indicator */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-colors ${
                      isSelected ? 'border-[#6C3FC5] bg-[#6C3FC5] text-white' : 'border-neutral-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-100 text-xs text-[#666666]">
                {lang.description}
              </div>
            </div>
          );
        })}
      </div>

      {/* Helper Note */}
      <div className="mt-6 text-center text-xs sm:text-sm font-medium text-[#666666]">
        You can change your language anytime using the header menu.
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 sm:mt-10 flex items-center justify-between gap-3 pt-4 border-t border-neutral-200">
        <button
          type="button"
          onClick={onBack}
          className="px-5 sm:px-6 py-3 bg-white border border-neutral-200 hover:bg-[#F3EEFC] hover:text-[#6C3FC5] text-[#171717] font-semibold rounded-xl flex items-center gap-2 transition-colors min-h-[48px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onContinue}
          className="px-7 sm:px-8 py-3 bg-[#6C3FC5] hover:bg-[#4B238C] text-white font-bold text-sm sm:text-base rounded-xl shadow-xs flex items-center gap-2 transition-all active:scale-[0.99] min-h-[48px]"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
