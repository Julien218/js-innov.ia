
export default function PowerWord({ children, className = '' }) {
  return (
    <span className={`power-word ${className}`}>
      {children}
    </span>
  );
}