import React, { useState } from 'react';
import './EditableTextField.css';

interface EditableTextFieldProps {
  label: string;
  value: string;
  onSave: (value: string) => void;
  editable?: boolean;
}

function EditableTextField({ label, value, onSave, editable = true }: EditableTextFieldProps) {
  const [inputValue, setInputValue] = useState(value);
  const [isEdited, setIsEdited] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsEdited(true);
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
          <input type="text" value={inputValue} onChange={handleChange} />
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
