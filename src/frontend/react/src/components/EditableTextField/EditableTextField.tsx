import React, { useState } from 'react';
import './EditableTextField.css';

interface EditableTextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onEdit?: (edited: boolean) => void;
  editable?: boolean;
}

function EditableTextField({ label, value, onChange, onEdit, editable = false }: EditableTextFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handleEdit = () => {
    if (editable) {
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    console.log("Saving changes:", inputValue);
    if (inputValue.length === 0) {
      setInputValue(value);
    }
    if (inputValue !== value) {
      onChange(inputValue);
    }
    if (onEdit) {
      onEdit(false);
    }
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (onEdit) {
      onEdit(e.target.value !== value);
    }
  };

  return (
    <div className="editable-text-field">
      <label>{label}: </label>
      {isEditing ? (
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          onBlur={handleSave}
          autoFocus
        />
      ) : (
        <span onClick={handleEdit}>{value}</span>
      )}
    </div>
  );
}

export default EditableTextField;
