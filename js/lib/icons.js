const paths = {
  cross: '<path d="M12 3v18M6 9h12"/>',
  church:
    '<path d="M12 2v3.6M10 3.8h4"/><path d="M5 21V12l7-5.5L19 12v9"/><path d="M9.5 21v-4.5a2.5 2.5 0 0 1 5 0V21"/><path d="M3.5 21h17"/>',
  book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5H6.5A2.5 2.5 0 0 0 4 21V5.5Z"/><path d="M8 7.5h7M8 11h5"/>',
  bookOpen:
    '<path d="M12 6.2C9.8 4.6 6.9 4 3.5 4.3v14.4c3.4-.3 6.3.3 8.5 1.9 2.2-1.6 5.1-2.2 8.5-1.9V4.3C17.1 4 14.2 4.6 12 6.2Z"/><path d="M12 6.2v14.4"/>',
  chalice:
    '<path d="M7 3h10l-1.1 6.2a4.1 4.1 0 0 1-7.8 0L7 3Z"/><path d="M12 13.4V19M8.5 21h7"/><path d="M16.8 5.5h2.7"/>',
  dove:
    '<path d="M20 6c-3.8.4-6.4 2.1-7.6 4.8C11 8.9 8.8 8 6 8.4c.9 1.4 1 2.6.5 4C4.4 13.7 3 15.6 3 18c2.9-.6 5.3-.2 7.2 1.2 2 1.5 4.7 1.2 6.4-.4 1.9-1.8 2.3-4.5 1.1-6.7-.3-.6-.2-1.2.2-1.7L20 6Z"/><path d="M13.8 9.3c.8.9 2 1.4 3.4 1.4"/>',
  candle:
    '<path d="M12 2.6c1.6 1.5 2.4 2.7 2.4 4a2.4 2.4 0 0 1-4.8 0c0-1.3.8-2.5 2.4-4Z"/><path d="M9 10h6v11H9z"/><path d="M9 14.5h6"/>',
  calendar:
    '<rect x="3.5" y="5" width="17" height="16" rx="2.5"/><path d="M8 3v4M16 3v4M3.5 10h17"/>',
  scroll:
    '<path d="M7 4.5h11.5A2.5 2.5 0 0 1 21 7v12.5"/><path d="M7 4.5A2.5 2.5 0 0 0 4.5 7v12.5A2.5 2.5 0 0 0 7 22h12"/><path d="M8 9h9M8 13h9M8 17h6"/>',
  users:
    '<path d="M16 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20"/><circle cx="9.5" cy="7.5" r="3.2"/><path d="M17.5 4.8a3.2 3.2 0 0 1 0 6.2M21 20v-1.2a4 4 0 0 0-2.8-3.8"/>',
  compass:
    '<circle cx="12" cy="12" r="8.8"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
  mic: '<rect x="9" y="3" width="6" height="10" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M9 21h6"/>',
  micOff:
    '<path d="M3 3l18 18"/><path d="M9 9v1a3 3 0 0 0 4.2 2.8M15 11V6a3 3 0 0 0-5.9-.8"/><path d="M5.5 11a6.5 6.5 0 0 0 10.2 5.4M18.5 11v.8M12 17.5V21M9 21h6"/>',
  speaker:
    '<path d="M4 9.5v5h3.5L13 19V5L7.5 9.5H4Z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>',
  speakerOff:
    '<path d="M4 9.5v5h3.5L13 19V5L7.5 9.5H4Z"/><path d="m16.5 9 5 6M21.5 9l-5 6"/>',
  stop: '<rect x="6.5" y="6.5" width="11" height="11" rx="2"/>',
  pause: '<path d="M9 5v14M15 5v14"/>',
  play: '<path d="m8 5 11 7-11 7V5Z"/>',
  settings:
    '<path d="M4 7h9M18 7h2M4 17h4M12 17h8"/><circle cx="15.5" cy="7" r="2.2"/><circle cx="10" cy="17" r="2.2"/>',
  send: '<path d="M21 3 10.5 13.5M21 3l-6.7 18-3.8-7.5L3 9.7 21 3Z"/>',
  sparkle:
    '<path d="M12 3l1.9 5.8 5.8 1.9-5.8 1.9L12 18.4l-1.9-5.8L4.3 10.7l5.8-1.9L12 3Z"/><path d="M19 16.5l.6 1.7 1.7.6-1.7.6-.6 1.7-.6-1.7-1.7-.6 1.7-.6.6-1.7Z"/>',
  arrowRight: '<path d="M4.5 12h15M13.5 6l6 6-6 6"/>',
  arrowLeft: '<path d="M19.5 12h-15M10.5 6l-6 6 6 6"/>',
  arrowUpRight: '<path d="M7 17 17 7M8 7h9v9"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  menu: '<path d="M4 7h16M4 17h10"/>',
  sun:
    '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"/>',
  moon: '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z"/>',
  globe:
    '<circle cx="12" cy="12" r="8.8"/><path d="M3.4 12h17.2M12 3.2c2.4 2.3 3.6 5.2 3.6 8.8s-1.2 6.5-3.6 8.8c-2.4-2.3-3.6-5.2-3.6-8.8S9.6 5.5 12 3.2Z"/>',
  heart:
    '<path d="M12 20.5S4 15.6 4 9.9A4.4 4.4 0 0 1 12 7a4.4 4.4 0 0 1 8 2.9c0 5.7-8 10.6-8 10.6Z"/>',
  shield:
    '<path d="M12 3l7 2.8v5.5c0 4.2-3 7.4-7 9.7-4-2.3-7-5.5-7-9.7V5.8L12 3Z"/><path d="m8.8 12 2.2 2.2 4.2-4.4"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/>',
  copy:
    '<rect x="8.5" y="8.5" width="12" height="12" rx="2"/><path d="M5.5 15.5h-1a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  check: '<path d="m4.5 12.5 5 5 10-11"/>',
  trash:
    '<path d="M4 7h16M9 7V4.5h6V7M6.5 7l.8 13.5h9.4L17.5 7M10 11v6M14 11v6"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 10.5V17M12 7.2v.2"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5.3l3.2 2"/>',
  star:
    '<path d="m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.3l6.1-.7L12 3Z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  retry: '<path d="M20 11a8 8 0 1 0-1.7 6.3"/><path d="M20 5v6h-6"/>',
  volume:
    '<path d="M4 9.5v5h3.5L13 19V5L7.5 9.5H4Z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/>',
  key:
    '<circle cx="8" cy="15" r="4"/><path d="m11 12 8-8M16 4h4v4M14 6l3 3"/>',
  headphones:
    '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="13" width="4" height="7" rx="2"/><rect x="17" y="13" width="4" height="7" rx="2"/>',
  message:
    '<path d="M20 15.5a2 2 0 0 1-2 2H8l-4.5 3v-13a2 2 0 0 1 2-2H18a2 2 0 0 1 2 2v8Z"/>',
  water:
    '<path d="M12 3.2s5.8 6.6 5.8 10.6a5.8 5.8 0 0 1-11.6 0C6.2 9.8 12 3.2 12 3.2Z"/><path d="M9 14.5a3 3 0 0 0 3 3"/>',
  oil:
    '<path d="M9.5 3h5M10 3v3.5L7 10a4 4 0 0 0-.7 2.3V20h11.4v-7.7A4 4 0 0 0 17 10l-3-3.5V3"/><path d="M8 15.5h8"/>',
  rings:
    '<circle cx="9.2" cy="14.2" r="4.8"/><circle cx="14.8" cy="14.2" r="4.8"/><path d="m12 3.5 2.1 2.1L12 7.7 9.9 5.6 12 3.5Z"/>',
  hands:
    '<path d="M8 12V6a2 2 0 0 1 4 0v6M12 11V4.5a2 2 0 0 1 4 0V12M16 12V7a2 2 0 0 1 4 0v7.5c0 3.6-2.7 6.5-6.3 6.5h-.7A6 6 0 0 1 8 16.5V12"/>',
  leaf:
    '<path d="M20 4c-8 0-13 3-13 9 0 3 2 5.5 5 6 6 1 8-6 8-15Z"/><path d="M5 21c1-5 4-8 9-11"/>',
  quote:
    '<path d="M9.5 6.5C6.5 8 5 10.5 5 14v3.5h5.5V12H7.7c0-1.8.8-3.2 2.5-4.2l-.7-1.3ZM19 6.5c-3 1.5-4.5 4-4.5 7.5v3.5h5.5V12h-2.8c0-1.8.8-3.2 2.5-4.2L19 6.5Z"/>',
  external:
    '<path d="M14 4h6v6M20 4l-9 9M18 14v4.5A2.5 2.5 0 0 1 15.5 21h-9A2.5 2.5 0 0 1 4 18.5v-9A2.5 2.5 0 0 1 6.5 7H11"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="2.8"/>',
  eyeOff:
    '<path d="M3 3l18 18"/><path d="M10.6 6.1A9 9 0 0 1 12 6c6 0 9.5 6 9.5 6a17 17 0 0 1-3.2 3.9M6.2 7.3A16 16 0 0 0 2.5 12S6 18 12 18a9 9 0 0 0 3.6-.7"/>',
  alert: '<path d="M12 3 2.8 20h18.4L12 3Z"/><path d="M12 9v5M12 17v.2"/>',
  flame:
    '<path d="M12 22c4 0 7-2.8 7-6.6 0-5.4-7-12.4-7-12.4S5 10 5 15.4C5 19.2 8 22 12 22Z"/><path d="M12 18c1.7 0 3-1.2 3-2.8 0-2.3-3-5.2-3-5.2s-3 2.9-3 5.2c0 1.6 1.3 2.8 3 2.8Z"/>',
};

export function icon(name, className = "") {
  const body = paths[name] || paths.cross;
  return `<svg class="icon ${className}" data-icon="${name}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;
}

export function copticCross(className = "") {
  return `<svg class="${className}" viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false">
    <circle cx="24" cy="24" r="22" stroke="currentColor" stroke-opacity=".35"/>
    <path d="M24 10v28M14 19.5h20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <circle cx="24" cy="10" r="2.5" fill="currentColor"/>
    <circle cx="14" cy="19.5" r="2.5" fill="currentColor"/>
    <circle cx="34" cy="19.5" r="2.5" fill="currentColor"/>
    <circle cx="24" cy="38" r="2.5" fill="currentColor"/>
  </svg>`;
}

export function ornament(markup = "") {
  return `<div class="ornament" aria-hidden="true">
    <span class="ornament-dots"><i></i><i></i></span>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M12 4v16M7 9.5h10"/><circle cx="12" cy="4" r="1.4" fill="currentColor"/><circle cx="7" cy="9.5" r="1.4" fill="currentColor"/><circle cx="17" cy="9.5" r="1.4" fill="currentColor"/><circle cx="12" cy="20" r="1.4" fill="currentColor"/></svg>
    ${markup}
  </div>`;
}
