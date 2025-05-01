import React, { useEffect, useState } from 'react';
import '../style/InputFields.scss'

const InputField = ({
  label,
  type = 'text',
  value,
  placeholder = '',
  control,
  errorMessages = {},
  onChange,
  name,
  touched,
  errors
}) => {
  const [errorKeys, setErrorKeys] = useState([]);

  useEffect(() => {
    if (errorMessages) {
      setErrorKeys(Object.keys(errorMessages));
    }
  }, [errorMessages]);

  return (
    <div className="form-group">
      <div className="form-label">{label}</div>
      <input
        className="form-control"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        required
      />
      <small className="text-danger">
        {touched && errors && (
          <>
            {errorKeys.map(
              (error) =>
                errors[error] && (
                  <p key={error}>{errorMessages[error]}</p>
                )
            )}
          </>
        )}
      </small>
    </div>
  );
};

export default InputField;
