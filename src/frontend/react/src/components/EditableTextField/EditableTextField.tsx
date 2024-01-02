import React, { useState } from 'react';
import './EditableTextField.css';

interface EditableTextFieldProps {
  label: string;
  value: string;
  onSave: (value: string) => void;
  editable?: boolean;
  maxLength?: number; // Ajout d'une nouvelle propriété pour la limite de caractères
}

function EditableTextField({ label, value, onSave, editable = true, maxLength = 25 }: EditableTextFieldProps) {
  const [inputValue, setInputValue] = useState(value || '');
  const [isEdited, setIsEdited] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (!maxLength || newValue.length <= maxLength) { // Vérifie la limite de caractères
      setInputValue(newValue);
      setIsEdited(true);
    }
  };

  const handleSave = () => {
    onSave(inputValue);
    setIsEdited(false);
  };

  return (
    <div className="editable-text-field">
      <label>{label}: </label>
      {editable ? (
        <>
          <input type="text" value={inputValue} onChange={handleChange} maxLength={maxLength} />
          {isEdited && (
            <button className='save-button' onClick={handleSave}>Sauvegarder</button>
          )}
        </>
      ) : (
        <span>{value}</span>
      )}
    </div>
  );
}

export default EditableTextField;
