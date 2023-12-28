import React, { ReactNode, FC } from 'react';

interface Modal2FAProps {
	onClose: () => void;
	children: ReactNode;
  }

const Modal2FA: FC<Modal2FAProps> = ({ onClose, children }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
		<p>Scannez ce Qrcode avec votre app google authentificator</p>
        <button className="modal-close" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
};

export default Modal2FA;
