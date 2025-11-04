import isValidEmail from '../utils/email-checker';

describe('email-checker', () => {
  it('accepts common valid emails', () => {
    const valid = [
      'user@example.com',
      'first.last@domain.co',
      'name+tag@sub.domain.io',
    ];
    for (const e of valid) {
      expect(isValidEmail(e)).toBe(true);
    }
  });

  it('rejects invalid emails', () => {
    const invalid = [
      '',
      'plainaddress',
      'user@',
      '@domain.com',
      'user@domain',
      'user domain@example.com',
    ];
    for (const e of invalid) {
      expect(isValidEmail(e)).toBe(false);
    }
  });
});
