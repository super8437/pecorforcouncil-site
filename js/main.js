// main.js – site‑wide scripts

// Donation intake form helper
// This script enforces Maine campaign finance rules on the client.
// It clamps donations to the $1–$600 range and toggles
// employer/occupation fields when the gift exceeds $50.
document.addEventListener('DOMContentLoaded', () => {
  const amt = document.querySelector('#amount');
  const emp = document.querySelector('#employer');
  const occ = document.querySelector('#occupation');

  function syncEmpOccRequired() {
    // Parse the numeric value of the amount input. Treat empty as 0.
    const v = parseFloat(amt.value || '0');
    const need = v > 50;
    if (emp) emp.toggleAttribute('required', need);
    if (occ) occ.toggleAttribute('required', need);
  }

  if (amt) {
    // When the donor types in an amount, cap it between $1 and $600.
    amt.addEventListener('input', () => {
      // Ensure the value is numeric and within bounds.
      let val = Number(amt.value);
      if (!Number.isFinite(val)) val = 0;
      if (val > 600) val = 600;
      if (val < 1) val = 1;
      // Reflect the clamped value back into the field only if it differs.
      if (val !== Number(amt.value)) {
        amt.value = String(val);
      }
      syncEmpOccRequired();
    });
    // Initialise the employer/occupation requirement on page load.
    syncEmpOccRequired();
  }
});