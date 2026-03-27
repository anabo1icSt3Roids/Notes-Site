function applyRole(role) {
  const uploadBtn = document.getElementById('uploadBtn');
  const adminBadge = document.getElementById('adminBadge');

  if (role === 'admin') {
    uploadBtn.style.display = 'block';
    adminBadge.style.display = 'inline-block';
  } else {
    uploadBtn.style.display = 'none';
    adminBadge.style.display = 'none';
  }
}

function viewNotes() {
  const branch = document.getElementById('branch').value;
  const sem = document.getElementById('sem').value;

  if (!branch) { alert('Please select a branch.'); return; }
  if (!sem) { alert('Please select a semester.'); return; }

  window.location.href = 'notes.html?branch=' + branch + '&sem=' + sem;
}

function uploadNotes() {
  const branch = document.getElementById('branch').value;
  const sem = document.getElementById('sem').value;

  if (!branch) { alert('Please select a branch before uploading.'); return; }
  if (!sem) { alert('Please select a semester before uploading.'); return; }

  window.location.href = 'upload.html?branch=' + branch + '&sem=' + sem;
}

function setRole(r) {
  localStorage.setItem('role', r);
  applyRole(r);
}

const role = localStorage.getItem('role') || 'student';
applyRole(role);
