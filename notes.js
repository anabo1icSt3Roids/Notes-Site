// notes.js - temporary, no backend yet

// --- Read branch and sem from URL ---
const params = new URLSearchParams(window.location.search);
const branch = params.get('branch');
const sem = params.get('sem');

// --- Update page title ---
document.getElementById('pageTitle').textContent = branch + ' - Semester ' + sem + ' Notes';

const dummyNotes = [
  {
    title: 'Data Structures',
    fileUrl: '#'
  },
  {
    title: 'Operating Systems',
    fileUrl: '#'
  },
  {
    title: 'DBMS',
    fileUrl: '#'
  },
  {
    title: 'Computer Networks',
    fileUrl: '#'
  }
];

// --- Render notes cards ---
function renderNotes(notes) {
  const grid = document.getElementById('notesGrid');
  const emptyMsg = document.getElementById('emptyMsg');

  if (notes.length === 0) {
    emptyMsg.style.display = 'block';
    return;
  }

  notes.forEach(function(note) {
    const card = document.createElement('div');
    card.className = 'note-card';

  card.innerHTML =
    '<h3>' + note.title + '</h3>' +
    '<p>Uploaded by: Admin</p>' +
    '<a href="' + note.fileUrl + '" target="_blank">Download</a>';

    grid.appendChild(card);
  });
}

// --- Later: replace dummyNotes with fetch call like this ---
// async function loadNotes() {
//   const res = await fetch('http://localhost:5000/api/notes?branch=' + branch + '&sem=' + sem);
//   const data = await res.json();
//   renderNotes(data.notes);
// }
// loadNotes();

// For now use dummy data
renderNotes(dummyNotes);
