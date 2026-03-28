import { Modal } from './Modal';

interface ConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    loading?: boolean;
}

export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Delete', loading }: ConfirmDialogProps) {
    return (
        <Modal open={open} onClose={onClose} title={title}>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="flex justify-end gap-3">
                <button onClick={onClose} className="px-4 py-2 text-sm rounded-md border hover:bg-gray-50">Cancel</button>
                <button
                    onClick={onConfirm}
                    disabled={loading}
                    className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                >
                    {loading ? 'Deleting...' : confirmLabel}
                </button>
            </div>
        </Modal>
    );
}
