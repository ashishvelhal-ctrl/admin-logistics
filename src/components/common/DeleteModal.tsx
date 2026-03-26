"use client";

import { Trash2, TriangleAlert } from "lucide-react";

type Props = {
  open: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => void;
};

const DeleteModal = ({ open, title, onClose, onConfirm }: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="w-[620px] bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <TriangleAlert className="size-5 text-icon-2-color" />
          Delete {title}
        </h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this {title.toLowerCase()}?
        </p>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="border px-4 py-2 rounded">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="border border-icon-2-color text-icon-2-color px-4 py-2 rounded flex items-center gap-2 hover:bg-icon-2-color hover:text-white"
          >
            <Trash2 className="size-4" />
            Delete {title}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
