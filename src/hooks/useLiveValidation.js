import { useState, useCallback, useMemo } from 'react';

export default function useLiveValidation(formData, schema) {
  const [touched, setTouched] = useState({});

  const evaluate = useCallback((data) => {
    const errors = {};
    const passed = {};

    for (const [field, rules] of Object.entries(schema)) {
      const value = data[field];
      const fieldErrors = [];
      const fieldPassed = [];

      for (const item of rules) {
        let ruleFn;
        let message;
        if (typeof item === 'function') {
          const result = item(value);
          ruleFn = result.rule;
          message = result.message;
        } else {
          ruleFn = item.rule;
          message = item.message;
        }
        if (ruleFn(value)) {
          fieldPassed.push(message);
        } else {
          fieldErrors.push(message);
        }
      }

      if (fieldErrors.length > 0) {
        errors[field] = fieldErrors;
      }
      if (fieldPassed.length > 0) {
        passed[field] = fieldPassed;
      }
    }

    return { errors, passed };
  }, [schema]);

  const { errors, passed } = useMemo(() => evaluate(formData), [formData, evaluate]);

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const touch = useCallback((field) => {
    setTouched((prev) => {
      if (prev[field]) return prev;
      return { ...prev, [field]: true };
    });
  }, []);

  const touchAll = useCallback(() => {
    const allTouched = {};
    for (const field of Object.keys(schema)) {
      allTouched[field] = true;
    }
    setTouched(allTouched);
  }, [schema]);

  const handleChangeWithTouch = useCallback((field, value, setter) => {
    setter((prev) => ({ ...prev, [field]: value }));
    touch(field);
  }, [touch]);

  const getFieldProps = useCallback((field, setter) => ({
    value: formData[field] || '',
    onChange: (e) => {
      const val = e.target?.value !== undefined ? e.target.value : e;
      handleChangeWithTouch(field, val, setter);
    },
    onBlur: () => touch(field),
  }), [formData, handleChangeWithTouch, touch]);

  return {
    errors,
    passed,
    isValid,
    touched,
    touch,
    touchAll,
    handleChangeWithTouch,
    getFieldProps,
  };
}
