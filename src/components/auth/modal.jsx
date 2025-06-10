const Modal = ({ show, onClose, title, children }) => {
  if (!show) return null;

  return (
    <div
      onClick={onClose} //배경 클릭시 팝업 닫기 o
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        color:'black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 50,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()} //팝업 내부 클릭시 닫기 x
        style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '1.5rem',
          width: '490px',    // 고정 가로 크기
          height: '620px',   // 고정 세로 크기
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '0.25rem',
            right: '0.75rem',
            fontSize: '1.75rem',
            fontWeight: '700',
            color: '#4B5563',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#111827')}
          onMouseLeave={e => (e.currentTarget.style.color = '#4B5563')}
        >
          &times;
        </button>
        <h3
          style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            marginBottom: '1rem',
          }}
        >
          {title}
        </h3>
        <div
          style={{
            fontSize: '0.875rem',
            lineHeight: 1.625,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;