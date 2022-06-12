import * as Yup from 'yup';

export function password() {
  return Yup.string()
    .matches(/[^a-z0-9]+/i, 'Passwords must have at least one non alphanumeric character')
    .matches(/\d+/i, "Passwords must have at least one digit ('0'-'9')")
    .matches(/[A-Z]+/, "Passwords must have at least one uppercase ('A'-'Z')")
    .matches(/[a-z]+/, "Passwords must have at least one lowercase ('a'-'z')")
    .min(6, 'Passwords must be at least 6 characters');
}
