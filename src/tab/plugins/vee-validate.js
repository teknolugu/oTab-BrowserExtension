import { extend } from 'vee-validate';
import { required, email, min } from 'vee-validate/dist/rules';

extend('min', {
  ...min,
  message: 'This field must be at least {length} characters',
});

extend('email', {
  ...email,
  message: 'Invalid email',
});
extend('required', {
  ...required,
  message: 'This field is required',
});
