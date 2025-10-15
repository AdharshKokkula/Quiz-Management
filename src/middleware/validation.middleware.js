/**
 * Validation Middleware
 */

import Validator from '../utils/validator.js';
import { errorResponse } from '../utils/response.js';

export const validateUser = (req, res, next) => {
  const { email, phone, name, password, role } = req.body;
  
  const fields = {};
  
  if (email !== undefined) {
    fields.email = {
      value: email,
      rules: [
        { type: 'required', message: 'Email is required' },
        { type: 'email', message: 'Invalid email format' }
      ]
    };
  }

  if (phone !== undefined) {
    fields.phone = {
      value: phone,
      rules: [
        { type: 'required', message: 'Phone is required' },
        { type: 'phone', message: 'Phone must be a valid 10-digit number' }
      ]
    };
  }

  if (name !== undefined) {
    fields.name = {
      value: name,
      rules: [
        { type: 'required', message: 'Name is required' },
        { type: 'minLength', minLength: 2, message: 'Name must be at least 2 characters' }
      ]
    };
  }

  if (password !== undefined) {
    fields.password = {
      value: password,
      rules: [
        { type: 'required', message: 'Password is required' },
        { type: 'password', message: 'Password must be at least 8 characters with uppercase, lowercase, and number' }
      ]
    };
  }

  if (role !== undefined) {
    fields.role = {
      value: role,
      rules: [
        {
          type: 'custom',
          validate: (value) => ['admin', 'moderator', 'coordinator', 'user'].includes(value),
          message: 'Role must be admin, moderator, coordinator, or user'
        }
      ]
    };
  }

  const validation = Validator.validate(fields);
  
  if (validation.error) {
    const errors = Object.values(validation.errorMsgs).flat().filter(msg => msg);
    return errorResponse(res, 'Validation failed', 400, errors);
  }

  next();
};

export const validateParticipant = (req, res, next) => {
  const { name, email, phone, type } = req.body;
  
  const fields = {};
  
  if (name !== undefined) {
    fields.name = {
      value: name,
      rules: [
        { type: 'required', message: 'Name is required' },
        { type: 'minLength', minLength: 2, message: 'Name must be at least 2 characters' }
      ]
    };
  }

  if (email !== undefined) {
    fields.email = {
      value: email,
      rules: [
        { type: 'required', message: 'Email is required' },
        { type: 'email', message: 'Invalid email format' }
      ]
    };
  }

  if (phone !== undefined && phone !== '') {
    fields.phone = {
      value: phone,
      rules: [
        { type: 'phone', message: 'Phone must be a valid 10-digit number' }
      ]
    };
  }

  if (type !== undefined) {
    fields.type = {
      value: type,
      rules: [
        {
          type: 'custom',
          validate: (value) => ['individual', 'school'].includes(value),
          message: 'Type must be individual or school'
        }
      ]
    };
  }

  const validation = Validator.validate(fields);
  
  if (validation.error) {
    const errors = Object.values(validation.errorMsgs).flat().filter(msg => msg);
    return errorResponse(res, 'Validation failed', 400, errors);
  }

  next();
};