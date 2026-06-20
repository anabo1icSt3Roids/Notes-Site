import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db } from './firebase-config.js';

const params = new URLSearchParams(window.location.search);
const branch = params.get('branch');
const sem = params.get('sem');

const notesGrid = document.getElementById('notesGrid');
const emptyMsg = document.getElementById('emptyMsg');
const pageTitle = document.getElementById('pageTitle');

if (branch && sem) pageTitle.textContent = `${branch} - Semester ${sem} Resources`;

async function fetchNotes() {
    if (!branch || !sem) return;

    notesGrid.innerHTML = 'Loading resources...';
    emptyMsg.style.display = 'none';

    try {
        const q = query(collection(db, "resources"), where("branch", "==", branch), where("semester", "==", sem));
        const snap = await getDocs(q);
        notesGrid.innerHTML = '';

        if (snap.empty) {
            emptyMsg.style.display = 'block';
            return;
        }

        snap.forEach(doc => {
            const data = doc.data();
            const viewUrl = data.pdfURL;
            const downUrl = viewUrl.replace('/upload/', '/upload/fl_attachment/');

            const card = document.createElement('div');
            card.className = 'note-card';
            card.innerHTML = `
                <div class="note-info">
                    <h3>${data.subject}</h3>
                    <p>${data.title}</p>
                    <small>📄 ${data.fileName}</small>
                </div>
                <div class="card-actions">
                    <a href="${viewUrl}" target="_blank" class="btn-access secondary">View</a>
                    <a href="${downUrl}" class="btn-access">Download</a>
                </div>
            `;
            notesGrid.appendChild(card);
        });
    } catch (e) {
        console.error(e);
        notesGrid.innerHTML = 'Connection Error.';
    }
}

fetchNotes();
