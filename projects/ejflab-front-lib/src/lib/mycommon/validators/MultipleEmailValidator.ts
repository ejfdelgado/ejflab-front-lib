import { AbstractControl, ValidatorFn } from '@angular/forms';

export function multipleEmailValidator(max: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let emails = control.value ? control.value.split(',') : [];
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const invalidEmails = emails.filter(
      (email: string) => !emailPattern.test(email.trim())
    );
    if (invalidEmails.length) {
      return invalidEmails.length
        ? { invalidEmail: { value: invalidEmails.join(',') } }
        : null;
    } else {
      emails = emails.filter((email: string) => email.trim());
      return emails.length > max
        ? { maxEmails: { value: emails.length } }
        : null;
    }
  };
}
