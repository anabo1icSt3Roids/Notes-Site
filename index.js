document.getElementById('viewBtn').addEventListener('click', () => {
  const branch = document.getElementById('branch').value;
  const sem = document.getElementById('sem').value;

  if (!branch) { alert('Please select a branch.'); return; }
  if (!sem) { alert('Please select a semester.'); return; }

  window.location.href = 'notes.html?branch=' + branch + '&sem=' + sem;
});
