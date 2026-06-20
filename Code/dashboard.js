import { addDoc, collection, deleteDoc, doc, getDocs, query, serverTimestamp, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db } from './firebase-config.js';

const CLOUD_NAME = "doob1oovc";
const UPLOAD_PRESET = "notesportal";

const uploadForm = document.getElementById('uploadForm');
const manageGrid = document.getElementById('manageGrid');
const globalViewGrid = document.getElementById('globalViewGrid');
const searchBtn = document.getElementById('searchBtn');

document.addEventListener('DOMContentLoaded', () => loadGlobalView());

// --- SECURE UPLOAD ---
uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const branch = document.getElementById('uploadBranch').value;
    const sem = document.getElementById('uploadSem').value;
    const subject = document.getElementById('uploadSubject').value;
    const title = document.getElementById('uploadTitle').value;
    const file = document.getElementById('uploadFile').files[0];

    if (!file) return alert('Select a file.');
    if (file.type !== "application/pdf") return alert('PDF only!');

    const submitBtn = uploadForm.querySelector('button');
    submitBtn.textContent = 'Uploading...';
    submitBtn.disabled = true;

    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
            method: "POST",
            body: formData
        });

        if (!response.ok) throw new Error("Cloudinary upload failed.");

        const data = await response.json();
        
        await addDoc(collection(db, "resources"), {
            title,
            branch,
            semester: sem,
            subject,
            fileName: file.name,
            pdfURL: data.secure_url,
            cloudinaryId: data.public_id,
            uploadedAt: serverTimestamp()
        });

        alert('Resource Uploaded Successfully!');
        uploadForm.reset();
        loadGlobalView();
        
    } catch (error) {
        console.error("DEBUG ERROR:", error);
        alert(`Error: ${error.message || 'Access Denied'}`);
    } finally {
        submitBtn.textContent = 'Upload Resource';
        submitBtn.disabled = false;
    }
});

// --- SEARCH & DELETE ---
searchBtn.addEventListener('click', async () => {
    const branch = document.getElementById('filterBranch').value;
    const sem = document.getElementById('filterSem').value;
    manageGrid.innerHTML = 'Searching...';

    try {
        const q = query(collection(db, "resources"), where("branch", "==", branch), where("semester", "==", sem));
        const querySnapshot = await getDocs(q);
        manageGrid.innerHTML = '';

        if (querySnapshot.empty) {
            manageGrid.innerHTML = 'No resources found.';
            return;
        }

        querySnapshot.forEach((docSnap) => {
            const res = docSnap.data();
            const card = document.createElement('div');
            card.className = 'pdf-card';
            card.innerHTML = `
                <p>${res.title}</p>
                <span>${res.subject} (Sem ${res.semester})</span>
                <button class="btn-delete" onclick="handleSecureDelete('${docSnap.id}')">Delete</button>
            `;
            manageGrid.appendChild(card);
        });
    } catch (e) { console.error(e); }
});

window.handleSecureDelete = async (docId) => {
    if (!confirm('Delete this resource permanently?')) return;
    try {
        // We delete from Firestore. Cloudinary cleanup requires a backend.
        await deleteDoc(doc(db, "resources", docId));
        alert('Deleted successfully.');
        searchBtn.click();
        loadGlobalView();
    } catch (error) {
        console.error("DELETE ERROR DETAILS:", error);
        alert(`Delete Failed: ${error.code === 'permission-denied' ? 'You are not an admin' : error.message}`);
    }
}

// --- GLOBAL VIEW ---
async function loadGlobalView() {
    globalViewGrid.innerHTML = 'Updating...';
    try {
        const querySnapshot = await getDocs(collection(db, "resources"));
        const all = [];
        querySnapshot.forEach(d => all.push({id: d.id, ...d.data()}));
        all.sort((a,b) => (b.uploadedAt?.seconds || 0) - (a.uploadedAt?.seconds || 0));

        globalViewGrid.innerHTML = '';
        ['CSE', 'ECE', 'ME', 'CE', 'EE'].forEach(br => {
            const div = document.createElement('div');
            div.className = 'branch';
            div.innerHTML = `<h3>${br}</h3>`;
            const ul = document.createElement('ul');
            for(let s=1; s<=8; s++) {
                const items = all.filter(n => n.branch === br && n.semester == s);
                const li = document.createElement('li');
                li.innerHTML = `Sem ${s} ${items.length ? `(${items.length} files)` : '(Empty)'}`;
                if(items.length) {
                    const subUl = document.createElement('ul');
                    items.forEach(i => subUl.innerHTML += `<li>${i.title}</li>`);
                    li.appendChild(subUl);
                } else { li.style.opacity = '0.3'; }
                ul.appendChild(li);
            }
            div.appendChild(ul);
            globalViewGrid.appendChild(div);
        });
    } catch (e) { console.error(e); }
}
