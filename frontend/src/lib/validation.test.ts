import { describe, expect, it } from 'vitest';
import { isBangladeshiPhone, savarAreaOptions } from './lists';

describe('Savar donor validation', () => {
  it('accepts valid Bangladeshi mobile numbers', () => {
    expect(isBangladeshiPhone('01712345678')).toBe(true);
    expect(isBangladeshiPhone('01398765432')).toBe(true);
  });

  it('rejects invalid phone patterns', () => {
    expect(isBangladeshiPhone('12345')).toBe(false);
    expect(isBangladeshiPhone('00987654321')).toBe(false);
  });

  it('includes Savar-specific area choices', () => {
    expect(savarAreaOptions.some((area) => area.toLowerCase().includes('savar'))).toBe(true);
    expect(savarAreaOptions.some((area) => area.toLowerCase().includes('ashulia'))).toBe(true);
  });
});
