export type IconName =
  | "piggy" | "coins" | "hash" | "orders" | "chart" | "headset" | "badge" | "menu" | "users" | "tag" | "phone" | "check" | "globe" | "external";

/* Stroked shapes carry pathLength="1" so `.icon-draw [stroke]` can draw every
   icon with one dasharray/dashoffset pair, whatever its real length. Filled
   shapes have no path to draw and are left alone. */
const paths: Record<IconName, React.ReactNode> = {
  piggy: <><path d="M4 12c0-3 3-5 7-5h3c2 0 3 1 4 2l2-1v4l-2 1c-.3 2-1.6 3.5-3 4v2h-3v-1.5h-3V18H6v-2.5C4.800 14.700 4 13.500 4 12Z" fill="currentColor"/><circle cx="15" cy="11" r=".9" fill="#fff"/></>,
  coins: <><ellipse cx="12" cy="6" rx="6" ry="2.500" fill="currentColor"/><path d="M6 8.500v3.500c0 1.400 2.700 2.500 6 2.500s6-1.100 6-2.500V8.500c0 1.400-2.700 2.500-6 2.500S6 9.900 6 8.500Z" fill="currentColor" opacity=".85"/><path d="M6 14v3.500C6 18.900 8.700 20 12 20s6-1.100 6-2.500V14c0 1.400-2.700 2.500-6 2.500S6 15.400 6 14Z" fill="currentColor" opacity=".7"/></>,
  hash: <path d="M9 4 8 9H4v2h3.600l-.8 4H3v2h3.400L5.500 21h2l.9-4h4l-.9 4h2l.9-4H20v-2h-3.600l.8-4H21V9h-3.400l.9-5h-2l-.9 5h-4l.9-5H9Zm-.8 7h4l-.8 4h-4l.8-4Z" fill="currentColor"/>,
  orders: <><rect x="3" y="5" width="18" height="14" rx="3" fill="currentColor"/><rect x="3" y="9" width="18" height="2.500" fill="#fff" opacity=".55"/></>,
  chart: <path pathLength={1} d="M4 19V5M4 19h16M7 15l4-4 3 3 5-6M15 8h4v4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>,
  headset: <path pathLength={1} d="M5 14v-2a7 7 0 0 1 14 0v2M5 14h2.500v4H6a1 1 0 0 1-1-1v-3Zm14 0h-2.500v4H18a1 1 0 0 0 1-1v-3Zm-1.500 4c0 1.500-2 2.500-5 2.500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>,
  badge: <><circle cx="12" cy="9" r="5.500" fill="currentColor"/><path d="m8.500 13.500-1.500 7 5-2.500 5 2.500-1.500-7" fill="currentColor" opacity=".75"/></>,
  menu: <path pathLength={1} d="M5 7h14M5 12h14M5 17h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>,
  users: <><circle cx="9" cy="8" r="3.500" fill="currentColor"/><path d="M2.500 19c.5-3.500 3-5 6.500-5s6 1.500 6.500 5H2.500Z" fill="currentColor"/><circle cx="17" cy="9" r="2.500" fill="currentColor" opacity=".6"/></>,
  tag: <path d="M3 12V4h8l10 10-8 8L3 12Zm5-5a1.500 1.500 0 1 0 0 3 1.500 1.500 0 0 0 0-3Z" fill="currentColor"/>,
  phone: <rect pathLength={1} x="7" y="2.500" width="10" height="19" rx="2.500" fill="none" stroke="currentColor" strokeWidth="2"/>,
  check: <path pathLength={1} d="m5 12.500 4.500 4.500L19 7.500" fill="none" stroke="currentColor" strokeWidth="2.500" strokeLinecap="round" strokeLinejoin="round"/>,
  globe: <><circle pathLength={1} cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2"/><path pathLength={1} d="M3 12h18M12 3c2.400 2.600 3.500 5.600 3.500 9s-1.100 6.400-3.500 9c-2.400-2.600-3.500-5.600-3.500-9s1.100-6.400 3.500-9Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>,
  external: <><path pathLength={1} d="M14 4h6v6M20 4l-9 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path pathLength={1} d="M18 14.500V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4.500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>,
};

export function Icon({ name, className = "size-5" }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      {paths[name]}
    </svg>
  );
}