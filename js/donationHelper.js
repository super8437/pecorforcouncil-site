function clampAmount(raw) {
  let val = Number(raw);
  if (!Number.isFinite(val)) val = 0;
  if (val > 600) val = 600;
  if (val < 1) val = 1;
  return val;
}

function syncEmpOccRequired(amtEl, empEl, occEl) {
  const v = parseFloat(amtEl.value || '0');
  const need = v > 50;
  if (empEl) empEl.toggleAttribute('required', need);
  if (occEl) occEl.toggleAttribute('required', need);
}

if (typeof module !== 'undefined') {
  module.exports = { clampAmount, syncEmpOccRequired };
} else {
  // expose to browser
  window.donationHelper = { clampAmount, syncEmpOccRequired };
}
