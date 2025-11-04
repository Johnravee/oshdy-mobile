import generateUniqueReceiptId from '../utils/receipt-generator';

describe('receipt-generator', () => {
  it('generates IDs matching pattern', () => {
    const id = generateUniqueReceiptId();
    expect(id).toMatch(/^REC-\d{8}-\d{6}-[A-Z0-9]{6}$/);
  });

  it('generates mostly unique IDs over many runs', () => {
    const set = new Set<string>();
    for (let i = 0; i < 200; i++) {
      set.add(generateUniqueReceiptId());
    }
    expect(set.size).toBe(200);
  });
});
