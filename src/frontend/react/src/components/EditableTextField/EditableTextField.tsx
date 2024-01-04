import React, { useState } from 'react';
import './EditableTextField.css';
import exp from 'constants';

interface EditableTextFieldProps {
  label: string;
  value: string;
  onSave: (value: string) => void;
  editable?: boolean;
  maxLength?: number;
  minLength?: number;
}

function EditableTextField({ label, value, onSave, editable = true, maxLength = 25, minLength = 3 }: EditableTextFieldProps) {
  const [inputValue, setInputValue] = useState(value || '');
  const [isEdited, setIsEdited] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsEdited(true);
  };

  const handleSave = () => {
    if (inputValue.length >= minLength && inputValue.length <= maxLength) {
      onSave(inputValue);
      setIsEdited(false);
    }/*  else {
      alert(`La longueur du texte doit être entre ${minLength} et ${maxLength} caractères.`);
    } */
  };

  return (
    <div className="editable-text-field">
      <label>{label}: </label>
      {editable ? (
        <>
          <input type="text" value={inputValue} onChange={handleChange} />
          {isEdited && (
            <button 
              className='save-button' 
              onClick={handleSave}
              disabled={inputValue.length < minLength || inputValue.length > maxLength}
            >
              Sauvegarder
            </button>
          )}
        </>
      ) : (
        <span>{value}</span>
      )}
    </div>
  );
}

export default EditableTextField;
