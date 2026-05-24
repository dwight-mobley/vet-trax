interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export default function ErrorModal({ isOpen, onClose, title, message }: ErrorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-large bg-background-paper p-6 text-center shadow-xl transition-all border border-slate-100">

        {/* Critical Error Icon (Using status-critical red) */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-status-critical/10 text-status-critical">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>

        {/* Typography */}
        <h3 className="mb-2 text-xl font-bold tracking-tight text-text-primary">{title}</h3>
        <p className="mb-6 text-sm text-text-secondary leading-relaxed">{message}</p>

        {/* Action Button */}
        <button
          type="button"
          onClick={onClose}
          className="inline-flex w-full justify-center rounded-medium bg-status-critical px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-colors cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
}