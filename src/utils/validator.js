/**
 * Validation Utility
 */

class Validator {
  static validate(fields) {
    const errors = {};
    const errorMsgs = {};

    for (const [fieldName, fieldData] of Object.entries(fields)) {
      const value = fieldData.value;
      const rules = fieldData.rules || [];
      const fieldErrors = [];

      for (const rule of rules) {
        const ruleType = rule.type;
        const message = rule.message;

        switch (ruleType) {
          case 'required':
            if (!value || value === '') fieldErrors.push(message);
            break;

          case 'minLength':
            if (value && value.length < rule.minLength) fieldErrors.push(message);
            break;

          case 'maxLength':
            if (value && value.length > rule.maxLength) fieldErrors.push(message);
            break;

          case 'email':
            if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) fieldErrors.push(message);
            break;

          case 'phone':
            if (value && !/^[6-9][0-9]{9}$/.test(value)) fieldErrors.push(message);
            break;

          case 'password':
            if (value && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(value))
              fieldErrors.push(message);
            break;

          case 'custom':
            if (rule.validate && value && !rule.validate(value)) fieldErrors.push(message);
            break;
        }
      }

      errors[fieldName] = fieldErrors.length > 0;
      errorMsgs[fieldName] = fieldErrors;
    }

    const errorCount = Object.values(errors).filter(Boolean).length;

    return {
      error: errorCount > 0,
      errorMsgs,
      fields: Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, v.value]))
    };
  }
}

export default Validator;