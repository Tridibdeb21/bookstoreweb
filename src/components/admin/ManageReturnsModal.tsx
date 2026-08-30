import React from 'react';
import { useStore } from '../../context/StoreContext';
import { X, RotateCcw, Check, XCircle, AlertCircle } from 'lucide-react';

export const ManageReturnsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { returnRequests, updateReturnStatus } = useStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        id="manage-returns-modal-container"
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 text-stone-900"
      >
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div>
            <h3 className="font-serif font-bold text-xl text-stone-900">
              Customer Return & Exchange Requests
            </h3>
            <p className="text-xs text-stone-500">
              Review reasons and approve or reject requested returns
            </p>
          </div>

          <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-100 text-stone-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {returnRequests.length === 0 ? (
            <div className="text-center py-10 text-stone-500">
              <RotateCcw className="w-12 h-12 text-stone-300 mx-auto mb-2" />
              <p className="font-serif font-bold">No Return Requests Currently</p>
              <p className="text-xs text-stone-400">All customer deliveries are in good standing.</p>
            </div>
          ) : (
            returnRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <span className="font-serif font-bold text-sm text-stone-900">
                      {req.bookTitle}
                    </span>
                    <span className="text-xs text-stone-500 ml-2 font-mono">(Order: {req.orderId})</span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      req.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : req.status === 'rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {req.status}
                  </span>
                </div>

                <div className="text-xs text-stone-700 bg-white p-3 rounded-xl border border-stone-200">
                  <span className="font-semibold text-stone-900">Reason: </span>"{req.reason}"
                </div>

                {req.status === 'pending' && (
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => updateReturnStatus(req.id, 'rejected')}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition"
                    >
                      Reject Return
                    </button>
                    <button
                      onClick={() => updateReturnStatus(req.id, 'approved')}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
                    >
                      Approve & Refund
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
