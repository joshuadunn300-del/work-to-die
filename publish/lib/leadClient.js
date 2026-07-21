function buildLeadClientScript(leadEndpoint) {
  const endpoint = JSON.stringify(leadEndpoint || '/__lead');
  return `
<script>
window.NovaLead = {
  endpoint: ${endpoint},
  submit: function(evt, form) {
    evt.preventDefault();
    var btn = form.querySelector('button[type="submit"]');
    var status = form.querySelector('.lead-form-status');
    if (btn.disabled) return false; // double-submit guard
    btn.disabled = true;
    var originalText = btn.textContent;
    btn.textContent = 'Sending...';
    var data = {};
    Array.prototype.forEach.call(form.elements, function(el) {
      if (el.name) data[el.name] = el.value;
    });
    data.site_id = form.getAttribute('data-site-id') || '';
    fetch(this.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(function(res) {
      if (!res.ok) throw new Error('request failed');
      status.textContent = "Thanks! We'll be in touch shortly.";
      form.reset();
    }).catch(function() {
      status.textContent = 'Something went wrong. Please try again.';
      btn.disabled = false;
      btn.textContent = originalText;
    });
    return false;
  }
};
</script>`;
}

module.exports = { buildLeadClientScript };
