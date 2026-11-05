import type { IconName } from './nav';

const PATHS: Record<IconName, string> = {
  home: 'M3 10.5 12 3l9 7.5V21H3V10.5Z M9 21v-7h6v7',
  book: 'M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5V5.5Z M20 18v3H6.5',
  robot: 'M7 9h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Z M12 5v4 M9.5 14h.01 M14.5 14h.01 M3 12H1 M23 12h-2',
  certificate: 'M5 3h14v12H5z M9 19h6 M12 15v4 M9 7h6 M9 10h4',
  wallet: 'M3 7.5A2.5 2.5 0 0 1 5.5 5H19a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5.5A2.5 2.5 0 0 1 3 16.5v-9Z M16 12h2',
  users: 'M16 19v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 17.5V19 M10 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z M20 19v-1.5a3.5 3.5 0 0 0-2.6-3.4 M15.5 4.3a3.5 3.5 0 0 1 0 6.4',
  shield: 'M12 3 20 6v6c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10V6l8-3Z M9 12.5 11.3 15 15.5 10',
  treasury: 'M3 10 12 4l9 6 M5 10v9h14v-9 M9 19v-5h6v5 M3 21h18',
  audit: 'M6 3h9l4 4v14H6z M14 3v5h5 M9 13h6 M9 17h4',
  sparkles: 'M12 3l1.7 4.6L18 9l-4.3 1.4L12 15l-1.7-4.6L6 9l4.3-1.4L12 3Z M18.5 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2Z',
  review: 'M9 11l2.5 2.5L17 8 M5 4h14v16H5z',
  verify: 'M12 3 20 6v6c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10V6l8-3Z M12 8v4l3 2',
  chart: 'M4 20V10 M10 20V4 M16 20v-6 M22 20H2',
  settings: 'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 1 1-4 0 1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 3 15H3a2 2 0 1 1 0-4 1.7 1.7 0 0 0 1.2-2.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 10 4V3a2 2 0 1 1 4 0 1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.7 1.7 0 0 0 21 11a2 2 0 1 1 0 4',
};

export function Icon({ name, size = 18, className = '' }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true"
    >
      {PATHS[name].split(' M').map((seg, i) => (
        <path key={i} d={i === 0 ? seg : `M${seg}`} />
      ))}
    </svg>
  );
}
