import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Modal({ isOpen, onClose, title, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
          >
            <div className={`flex items-center justify-between p-6 ${title ? 'border-b border-gray-100' : 'absolute right-0 top-0 z-10'}`}>
              {title && <h3 className="text-xl font-bold text-gray-900">{title}</h3>}
              <button
                onClick={onClose}
                className={`text-gray-400 hover:text-gray-500 hover:bg-gray-100 p-2 rounded-full transition-colors ${!title ? 'm-2 bg-white/20 backdrop-blur-md text-white hover:bg-white/40' : ''}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className={`${title ? 'p-6' : ''} overflow-y-auto max-h-[80vh]`}>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
