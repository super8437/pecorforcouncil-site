const { clampAmount, syncEmpOccRequired } = require('../js/donationHelper');
const { JSDOM } = require('jsdom');

describe('donation helper', () => {
  test('values below 1 clamp to 1', () => {
    expect(clampAmount(0)).toBe(1);
    expect(clampAmount(-5)).toBe(1);
  });

  test('values above 600 clamp to 600', () => {
    expect(clampAmount(700)).toBe(600);
    expect(clampAmount(601)).toBe(600);
  });

  test('employer and occupation fields toggle required when amount crosses $50', () => {
    const dom = new JSDOM(`<input id="amt"><input id="emp"><input id="occ">`);
    const doc = dom.window.document;
    const amt = doc.getElementById('amt');
    const emp = doc.getElementById('emp');
    const occ = doc.getElementById('occ');

    amt.value = '50';
    syncEmpOccRequired(amt, emp, occ);
    expect(emp.required).toBe(false);
    expect(occ.required).toBe(false);

    amt.value = '51';
    syncEmpOccRequired(amt, emp, occ);
    expect(emp.required).toBe(true);
    expect(occ.required).toBe(true);
  });
});

