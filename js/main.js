// main.js – site‑wide scripts

// Donation intake form helper
// This script enforces Maine campaign finance rules on the client.
// It caps the donation amount at the statutory limit, and toggles
// employer/occupation requirements when the gift exceeds $50.
document.addEventListener('DOMContentLoaded', () => {
  const amt = document.querySelector('#amount');
  const emp = document.querySelector('#employer');
  const occ = document.querySelector('#occupation');

  if (amt && window.donationHelper) {
    const { clampAmount, syncEmpOccRequired } = window.donationHelper;
    // When the donor types in an amount, cap it between $1 and $600.
    amt.addEventListener('input', () => {
      const val = clampAmount(amt.value);
      // Reflect the clamped value back into the field only if it differs.
      if (val !== Number(amt.value)) {
        amt.value = String(val);
      }
      syncEmpOccRequired(amt, emp, occ);
    });
    // Initialise the employer/occupation requirement on page load.
    syncEmpOccRequired(amt, emp, occ);
  }
});

