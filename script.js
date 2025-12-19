let totalSeconds = 1500;
let selectedMinutes = 2;
let interval = null;

const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');

function updateDisplay() {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  minutesEl.textContent = String(minutes).padStart(2, '0');
  secondsEl.textContent = String(seconds).padStart(2, '0');
}

function startTimer() {
  if (interval) return;

  interval = setInterval(() => {
    if (totalSeconds > 0) {
      totalSeconds--;
      updateDisplay();
    } else {
      clearInterval(interval);
      interval = null;
    }
  }, 1000);

  startBtn.style.display = 'none';
  pauseBtn.style.display = 'inline-block';
}

function pauseTimer() {
  clearInterval(interval);
  interval = null;

  startBtn.style.display = 'inline-block';
  pauseBtn.style.display = 'none';
}

function resetTimer() {
  pauseTimer();
  totalSeconds = selectedMinutes * 60;
  updateDisplay();
}

function setTimer(minutes) {
  selectedMinutes = minutes;
  pauseTimer();
  totalSeconds = minutes * 60;
  updateDisplay();

  startBtn.style.display = 'inline-block';
  pauseBtn.style.display = 'none';
}

document.getElementById('time1').addEventListener('click', () => setTimer(10)); 
document.getElementById('time2').addEventListener('click', () => setTimer(5)); 
document.getElementById('time3').addEventListener('click', () => setTimer(25)); 

setTimer(25); 

function fixMobileVH() {
  document.querySelector("#home").style.height = window.innerHeight + "px";
}
window.addEventListener("resize", fixMobileVH);
fixMobileVH();

const SUPABASE_URL = 'https://fqmwxizmarpdwdadjuil.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_0U39m-AQ28dV1R6RJoM4Nw_meVs_305';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let user = null;
let notes = [];
let currentNoteId = null;


function showLoading() {
    document.getElementById("loading-overlay").style.display = "flex";
}
  
function hideLoading() {
    document.getElementById("loading-overlay").style.display = "none";
}


async function signUp() {
  showLoading();
  const email = document.getElementById("auth-email").value;
  const password = document.getElementById("auth-password").value;

  const { data, error } = await supabase.auth.signUp({ email, password });
  hideLoading();
  if (error) return alert("Signup error: " + error.message + " -Use Log In Instead.");

  if (data.session) {
    alert("Signup and login successful!");
    location.reload();
  } else {
    alert("Signup successful! Please check your email to confirm.");
  }
}

async function logIn() {
  showLoading();
  const email = document.getElementById("auth-email").value;
  const password = document.getElementById("auth-password").value;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  hideLoading();
  if (error) return alert("Login error: " + error.message);
  location.reload();
}

async function logOut() {
  await supabase.auth.signOut();
  localStorage.clear();
  location.reload();
}


function showNote(note) {
    document.getElementById("show-note").style.display = "block";
    document.getElementById("hide-show-note").style.display = "block"; 

    document.getElementById("edit-note-title").value = note.title;
    document.getElementById("edit-note-content").value = note.content;
  
    currentNoteId = note.id;

    document.getElementById("save-button").style.display = "none";
}

function startEditing() {
    document.getElementById("save-button").style.display = "inline-block";
}

async function saveEditedNote() {
    showLoading();
    const newTitle = document.getElementById("edit-note-title").value.trim();
    const newContent = document.getElementById("edit-note-content").value.trim();
  
    if (!newTitle) {
      document.getElementById("edit-title-error").textContent = "Title cannot be empty.";
      document.getElementById("edit-title-error").style.color = "red";
      hideLoading();
      return;
    }
  
    const { data, error } = await supabase.from("notes")
      .update({ title: newTitle, content: newContent })
      .eq('id', currentNoteId)
      .select();

    if (error) {
      alert("Error saving changes: " + error.message);
      hideLoading();
      return;
    }
    document.getElementById("edit-title-error").textContent = "";
    await loadNotes();
    
    hideLoading();
    hideNote();
}

async function deleteNote() {
    const confirmDelete = confirm("Are you sure you want to delete this note?");
    if (!confirmDelete) return;
    
    showLoading();
  
    const { error } = await supabase.from("notes").delete().eq("id", currentNoteId);
    if (error) {
      alert("Delete failed: " + error.message);
      hideLoading();
      return;
    }

    await loadNotes();
    
    hideLoading();
    hideNote();
}

function hideNote() {
    document.getElementById("show-note").style.display = "none";
    document.getElementById("hide-show-note").style.display = "none";
}

async function loadNotes() {

  const { data, error } = await supabase.from("notes").select("*").order("created_at", { ascending: false });
  if (!error && data) {
    notes = data;
    document.querySelectorAll(".category").forEach(div => (div.innerHTML = ""));
    notes.forEach(renderNote);
  }
}

function renderNote(note) {
    const noteDiv = document.createElement("div");
    noteDiv.className = "note";
    if (note.important) noteDiv.classList.add("important");
  
    noteDiv.innerHTML = `
      <div class="note-title-row">
        <div class="note-title-text">${note.title}</div>
        ${note.important ? '<div class="important-label">IMPORTANT</div>' : ''}
      </div>
      <div class="note-date">${new Date(note.created_at).toLocaleString([], {year: 'numeric',month: 'short',day: 'numeric',hour: '2-digit',minute: '2-digit'})}</div>
    `;
  
    noteDiv.addEventListener("click", () => {
      showNote(note);
    });
  
    const container = document.getElementById(`${note.category}-notes`);
    container.appendChild(noteDiv);
}

async function saveNote() {
  const title = document.getElementById("note-title").value.trim();
  const content = document.getElementById("note-content").value.trim();
  const category = document.getElementById("note-category").value;
  const important = document.getElementById("note-important").checked;

  if (!title) {
      document.getElementById("title-error").textContent = "Title cannot be empty.";
      document.getElementById("title-error").style.color = "red";
      return;
    }

  const { data, error } = await supabase.from("notes").insert({
    title,
    content,
    category,
    important
  }).select();

  if (!error && data) {
    notes.unshift(data[0]);
    renderNote(data[0]);
    closeNote();
  } else {
    alert("Login is required.");
  }
}


function showModal() {
  document.getElementById("modal").style.display = "block";
  document.getElementById("note-title").value = "";
  document.getElementById("note-content").value = "";
  document.getElementById("note-important").checked = false;
  document.getElementById("important-label").classList.remove("active");
}

function closeNote() {
  document.getElementById("modal").style.display = "none";
}


document.addEventListener("DOMContentLoaded", async () => {

    const session = await supabase.auth.getSession();
    user = session.data.session?.user;
  
    if (user) {
      document.getElementById("auth").style.display = "none";
      document.getElementById("user-info").style.display = "block";
      document.getElementById("user-email").textContent = user.email;
      loadNotes();
    }
  
    document.getElementById("add-note-button").addEventListener("click", showModal);
  
    document.querySelectorAll(".category-button").forEach(button => {
      button.addEventListener("click", () => {
        document.querySelectorAll(".category-button").forEach(b => b.classList.remove("selected"));
        button.classList.add("selected");
        document.getElementById("note-category").value = button.dataset.category;
      });
    });
  
    const label = document.getElementById("important-label");
    const checkbox = document.getElementById("note-important");
    label.addEventListener("click", (e) => {
      e.preventDefault();
      checkbox.checked = !checkbox.checked;
      label.classList.toggle("active", checkbox.checked);
    });
});




