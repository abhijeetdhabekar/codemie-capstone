export default function Message({ type = 'error', children }) {
  return <div className={`alert alert-${type}`}>{children}</div>;
}
