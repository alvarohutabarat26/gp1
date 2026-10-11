import React from 'react';

interface CountryFlagProps {
  country: string;
  className?: string;
}

const COUNTRY_MAP: Record<string, string> = {
  // ISO codes
  nl: 'nl', gb: 'gb', mc: 'mc', au: 'au', es: 'es', mx: 'mx',
  de: 'de', fr: 'fr', jp: 'jp', ca: 'ca', it: 'it', dk: 'dk',
  th: 'th', za: 'za', pt: 'pt', id: 'id', at: 'at', ch: 'ch',
  fi: 'fi', us: 'us', br: 'br', sg: 'sg', my: 'my', cn: 'cn',
  bh: 'bh', sa: 'sa', ae: 'ae', qa: 'qa', az: 'az', hu: 'hu',
  be: 'be',

  // Nationalities
  dutch: 'nl', british: 'gb', monegasque: 'mc', australian: 'au',
  spanish: 'es', mexican: 'mx', german: 'de', french: 'fr',
  japanese: 'jp', canadian: 'ca', italian: 'it', danish: 'dk',
  thai: 'th', 'south african': 'za', portuguese: 'pt',
  indonesian: 'id', austrian: 'at', swiss: 'ch', finnish: 'fi',
  american: 'us', brazilian: 'br', argentinian: 'ar', chinese: 'cn',

  // Indonesian / English names
  belanda: 'nl', inggris: 'gb', monako: 'mc', australia: 'au',
  spanyol: 'es', meksiko: 'mx', jerman: 'de', prancis: 'fr',
  jepang: 'jp', kanada: 'ca', italia: 'it', denmark: 'dk',
  thailand: 'th', 'afrika selatan': 'za', portugal: 'pt',
  indonesia: 'id', austria: 'at', swiss_id: 'ch', finlandia: 'fi',
  'amerika serikat': 'us', brasil: 'br', singapura: 'sg',
  malaysia: 'my', cina: 'cn', tiongkok: 'cn'
};

export const CountryFlag: React.FC<CountryFlagProps> = ({
  country,
  className = 'w-5 h-3.5'
}) => {
  const key = country.toLowerCase().trim();
  const iso = COUNTRY_MAP[key] || (key.length === 2 ? key : 'un');

  return (
    <img
      src={`https://flagcdn.com/w40/${iso}.png`}
      srcSet={`https://flagcdn.com/w80/${iso}.png 2x`}
      alt={country}
      loading="lazy"
      className={`inline-block rounded-xs object-cover shadow-xs border border-white/10 shrink-0 ${className}`}
      onError={(e) => {
        // Fallback: hide broken img
        const target = e.currentTarget;
        target.style.display = 'none';
      }}
    />
  );
};
