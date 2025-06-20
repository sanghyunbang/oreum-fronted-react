export default function IconButton({ icon, label }) {
  return (
    <button style={{
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 12px',
      border: '1px solid #ccc',
      borderRadius: '6px',
      backgroundColor: '#f9f9f9'
    }}>
      {icon}
      <span>{label}</span>
    </button>
  );
}