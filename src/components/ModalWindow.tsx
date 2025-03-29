import { useState } from "react";
import "./styleModal.css";

interface ModalWindowProps {
  prices: { [key: string]: string };
  tokens: { [key: string]: string };
  onTokenChange: (token: string, value: string) => void;
  onSave: () => void;
}

const ModalWindow = ({ prices, tokens, onTokenChange }: ModalWindowProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenModal = () => setIsOpen(!isOpen);
  return (
    <>
      <button onClick={handleOpenModal} className="btn-add-portfel">
        Open menu
      </button>

      {isOpen &&
        (Object.entries(prices).length > 0 ? (
          Object.entries(prices).map(([key, val]) => (
            <div key={key} className="container__add-token">
              <p>{key}</p>
              <span>{parseFloat(val).toFixed(2)}</span>
              <input
                type="number"
                value={tokens[key] || ""}
                onChange={(e) => onTokenChange(key, e.target.value)}
              />
            </div>
          ))
        ) : (
          <div>Loading data...</div>
        ))}
    </>
  );
};

export default ModalWindow;
