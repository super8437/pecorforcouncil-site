(function () {
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('form[data-progressive-security]').forEach(function (form) {
      var captchaContainer = form.querySelector('.captcha-container');
      var awaitingCaptcha = false;

      form.addEventListener('submit', async function (e) {
        if (awaitingCaptcha) {
          return; // allow normal submission with CAPTCHA token
        }
        e.preventDefault();
        var formData = new FormData(form);
        var response = await fetch(form.action, {
          method: form.method,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(formData)
        });

        if (response.status === 303) {
          var loc = response.headers.get('Location');
          if (loc) window.location.href = loc;
          return;
        }

        var data = {};
        try { data = await response.json(); } catch (err) {}
        if (response.status === 429 && data.captcha_required) {
          awaitingCaptcha = true;
          if (captchaContainer) captchaContainer.style.display = 'block';
          return;
        }

        alert(data.message || 'Submission failed');
      });
    });
  });
})();
