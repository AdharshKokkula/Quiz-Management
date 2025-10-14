class Validator {
 
  static validate(fields) {
    const errors = {};
    const errorMsgs = {};

    for (const [fieldName, fieldData] of Object.entries(fields)) {
      const value = fieldData.value;
      const rules = fieldData.rules || [];
      const callbacks = fieldData.callbacks || [];
      const fieldErrors = [];

      // Apply rules
      for (const rule of rules) {
        const ruleType = rule.type;
        const message = rule.message;

        switch (ruleType) {
          case "required":
            if (!value || value === "") fieldErrors.push(message);
            break;

          case "minLength":
            if (value && value.length < rule.minLength) fieldErrors.push(message);
            break;

          case "maxLength":
            if (value && value.length > rule.maxLength) fieldErrors.push(message);
            break;

          case "email":
            if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) fieldErrors.push(message);
            break;

          case "phone":
            if (value && !/^[6-9][0-9]{9}$/.test(value)) fieldErrors.push(message);
            break;

          case "pan":
            if (value && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)) fieldErrors.push(message);
            break;

          case "aadhaar":
            if (value && !/^[2-9]{1}[0-9]{11}$/.test(value)) fieldErrors.push(message);
            break;

          case "password":
            if (
              value &&
              !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)
            )
              fieldErrors.push(message);
            break;

          case "url":
            if (value && !/^(https?:\/\/)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/\S*)?$/.test(value))
              fieldErrors.push(message);
            break;

          case "domain":
            if (value && !/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) fieldErrors.push(message);
            break;

          default:
            // Custom validation
            if (rule.validate && value && !rule.validate(value)) fieldErrors.push(message);
            break;
        }
      }

      // Apply callbacks
      for (const cb of callbacks) {
        if (cb.validate && !cb.validate(value)) fieldErrors.push(cb.message);
      }

      errors[fieldName] = fieldErrors.length > 0;
      errorMsgs[fieldName] = fieldErrors;
    }

    const errorCount = Object.values(errors).filter(Boolean).length;

    return {
      error: errorCount > 0,
      errorMsgs,
      fields: Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, v.value])),
    };
  }
}

export default Validator;
