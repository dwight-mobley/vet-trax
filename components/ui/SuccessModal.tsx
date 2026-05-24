interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export default function SuccessModal({ isOpen, onClose, title, message }: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />


      <div className="relative w-full max-w-md transform overflow-hidden rounded-large bg-background-paper p-6 text-center shadow-xl transition-all border border-slate-100">


        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-status-healthy/10 text-status-healthy">
          <svg
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>


        <h3 className="mb-2 text-xl font-bold tracking-tight text-text-primary">
          {title}
        </h3>
        <p className="mb-6 text-sm text-text-secondary leading-relaxed">
          {message}
        </p>


        <button
          type="button"
          onClick={onClose}
          className="inline-flex w-full justify-center rounded-medium bg-primary px-4 py-2.5 text-sm font-semibold text-primary-contrast shadow-sm hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors cursor-pointer"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}