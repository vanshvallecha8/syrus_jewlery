/**
 * GlassPanel — reusable glassmorphism container.
 *
 * Props:
 *  - className: extra Tailwind classes
 *  - children: panel content
 */
export default function GlassPanel({ className = "", children }) {
  return (
    <div className={`glass p-6 ${className}`}>
      {children}
    </div>
  );
}
