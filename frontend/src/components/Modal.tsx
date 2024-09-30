import React from 'react';
import ReactModal from 'react-modal';

ReactModal.setAppElement('#root'); // Accessibility

interface ModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onRequestClose,
  title,
  children,
  footer,
}) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={title || 'Modal'}
      className="max-w-lg mx-auto mt-24 bg-white dark:bg-gray-800 rounded shadow-lg p-6 outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
      <div>{children}</div>
      {footer && <div className="mt-4">{footer}</div>}
    </ReactModal>
  );
};

export default Modal;