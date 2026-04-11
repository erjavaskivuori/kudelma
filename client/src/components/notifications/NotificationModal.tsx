import { useNavigate } from 'react-router';
import { closeModal } from '../../services/notifications/notificationSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';

const NotificationModal = () => {
  const modal = useAppSelector((state) => state.notifications.modal);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  if (!modal) {
    return null;
  }

  const handleClose = () => {
    dispatch(closeModal());
  };

  const handleAction = (to?: string) => {
    dispatch(closeModal());
    if (to) {
      void navigate(to);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      onClick={handleClose}
      role="presentation"
    >
      <div
        className="w-full max-w-md rounded-2xl border border-white/20 bg-white p-5 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="app-notification-title"
        aria-describedby="app-notification-message"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="app-notification-title"
          className="text-lg font-semibold text-slate-900"
        >
          {modal.title}
        </h2>
        <p id="app-notification-message" className="mt-2 text-sm text-slate-700">
          {modal.message}
        </p>
        <div className="mt-4 flex flex-wrap justify-end gap-2">
          {modal.secondaryAction && (
            <button
              type="button"
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium
                text-slate-700 transition-colors hover:bg-slate-100"
              onClick={() => handleAction(modal.secondaryAction?.to)}
            >
              {modal.secondaryAction.label}
            </button>
          )}
          {modal.primaryAction && (
            <button
              type="button"
              className="rounded-xl bg-[var(--color-popup)] px-3 py-2 text-sm font-semibold
                text-white transition-colors hover:bg-[var(--color-extra-dark)]"
              onClick={() => handleAction(modal.primaryAction?.to)}
            >
              {modal.primaryAction.label}
            </button>
          )}
          {!modal.primaryAction && !modal.secondaryAction && (
            <button
              type="button"
              className="rounded-xl bg-[var(--color-popup)] px-3 py-2 text-sm font-semibold
                text-white transition-colors hover:bg-[var(--color-extra-dark)]"
              onClick={handleClose}
            >
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
