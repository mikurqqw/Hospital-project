import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children }) => {
  const dialog = useRef(null);
  const titleId = useId();
  useEffect(() => {
    if (isOpen && !dialog.current.open) dialog.current.showModal();
    if (!isOpen && dialog.current.open) dialog.current.close();
  }, [isOpen]);
  return <dialog ref={dialog} aria-labelledby={titleId}
    onCancel={onClose}
    onClick={(event) => { if (event.target === dialog.current) onClose(); }}
    className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl p-0 border border-gray-200 dark:border-gray-700 bg-cardLight dark:bg-cardDark text-textMain dark:text-textMainDark shadow-2xl backdrop:bg-black/60">
    <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
      <h2 id={titleId} className="text-2xl font-bold">{title}</h2>
      <button aria-label="Закрыть" onClick={onClose} className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"><X className="w-5 h-5" /></button>
    </div>
    <div className="p-6">{children}</div>
  </dialog>;
};
export default Modal;
