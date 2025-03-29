import { useState } from "react";
import "./styleModal.css";

interface ModalWindowProps {
  prices: { [key: string]: string };
  tokens: { [key: string]: string };
  onTokenChange: (token: string, value: string) => void;
}

const ModalWindow = ({ prices, tokens, onTokenChange }: ModalWindowProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenModal = () => setIsOpen(!isOpen);

  return (
    <>
      <button onClick={handleOpenModal} className="btn-add-portfel">
        Open menu
      </button>

      {isOpen && (
        <div className="modal-overlay" onClick={handleOpenModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleOpenModal}>
              ×
            </button>
            <h3>Add Tokens</h3>
            <div className="token-inputs">
              {Object.entries(prices).map(([key, val]) => (
                <div key={key} className="container__add-token">
                  <p>{key}</p>
                  <span>{parseFloat(val).toFixed(2)}</span>
                  <input
                    type="number"
                    value={tokens[key] || ""}
                    onChange={(e) => onTokenChange(key, e.target.value)}
                    placeholder="Amount"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalWindow;
