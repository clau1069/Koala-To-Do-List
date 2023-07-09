/* APLICACIÓN DE NOTAS.
- Se debe poder crear y eliminar notas.
- La aplicación debe contar con un filtro para buscar por texto.
- También debe tener un filtro por checkbox para ver sólo las completadas.
- Los filtros tienen que funcionar combinados.
- Las notas tienen que persistir al recargar la página ( localStorage) */

mdxFileToHTML('')

/**
 * @param {string} path
 * Hacer click aquí para ir a la función loadNotes: {@link loadNotes }
 * 
 *Hacer click aquí para ir a la función  saveInLocalStorage {@link saveInLocalStorage }

 *Hacer click aquí para ir a la función saveInLocalStorage {@link saveInLocalStorage }

 *Hacer click aquí para ir a la función listenChangesInNotes {@link listenChangesInNotes }

 *Hacer click aquí para ir a la función convertToEditable {@link convertToEditable }

 *Hacer click aquí para ir a la función updateNote {@link updateNote }

 *Hacer click aquí para ir a la función  localStorageUpdate{@link localStorageUpdate }

 *Hacer click aquí para ir a la función  visualUpdate{@link  visualUpdate}

 *Hacer click aquí para ir a la función  removeNote{@link removeNote }

 *Hacer click aquí para ir a la función  filterNotes{@link  filterNotes}

 *Hacer click aquí para ir a la función  fiterBySearch{@link  fiterBySearch}

 *Hacer click aquí para ir a la función  checkNote{@link  checkNote}

 *Hacer click aquí para ir a la función  newNoteHTML{@link  newNoteHTML}

 *Hacer click aquí para ir a la función  newNoteHTMLEditable{@link  newNoteHTMLEditable}

 *Hacer click aquí para ir a la función  getTitle{@link  getTitle}

 *Hacer click aquí para ir a la función  getContent{@link  getContent}

 *Hacer click aquí para ir a la función  getNoteOfLocalStorage{@link  getNoteOfLocalStorage}
 */
function mdxFileToHTML(path){
    return new Promise((string)=>{
        const data = {
            key: string || any
        }
        const html= string
    })
} 

//DOM
const btnCreateNew = document.getElementById("btn-create-new")
const inputCreateNoteTitle = document.getElementById("input-create-note-title")
const inputCreateNoteContent= document.getElementById("input-create-note-content")
const contenedorNotas = document.getElementById('contenedor-notas');
/* const btnRemove = document.getElementsByClassName("remove") */
const btnSearch = document.getElementById("input-search")
const checkboxSearch = document.getElementById("checkbox-search")
const formSearch = document.getElementById("search") 

let localStorageKeys = Object.keys(localStorage).sort(function (a, b) {
    return a - b
})
let lastNoteId = localStorageKeys[localStorageKeys.length - 1] || 0

//EVENTOS
document.addEventListener("DOMContentLoaded", loadNotes())
btnCreateNew.addEventListener("click", createNewNote)
contenedorNotas.addEventListener("click", listenChangesInNotes)
formSearch.addEventListener("input", filterNotes)



//FUNCIONES
//cargarNotas
function loadNotes() {
    localStorageKeys.forEach((id) => {
        let notaObject = JSON.parse(localStorage.getItem(id))
        let titleString = notaObject.title
        let contentString = notaObject.content
        let checked = notaObject.checked
        createNewNoteVisually(id, titleString, contentString, checked)
    })
}




//FUNCIONES PARA CREAR
let bottomSheetForm = document.getElementById("bottom-sheet")
let closeBtn= document.getElementById("close-bottom-sheet")
let floatingBtnCreate= document.getElementById("btn-flotante-crear")
closeBtn.addEventListener("click", closeBottomSheet)
floatingBtnCreate.addEventListener("click", revealBottomSheet)
function closeBottomSheet(){
    bottomSheetForm.classList.add("disabled")
    floatingBtnCreate.classList.remove("disabled")
    console.log(closeBtn);
}
function revealBottomSheet(){
    inputCreateNoteTitle.value = ""
    inputCreateNoteContent.value = ""
    bottomSheetForm.classList.remove("disabled")
    floatingBtnCreate.classList.add("disabled")
}
function createNewNote(e) {
    e.preventDefault()
    if (bottomSheetForm.checkValidity()) {
    lastNoteId++
    let newNoteTitle = inputCreateNoteTitle.value
    let newNoteContent = inputCreateNoteContent.value
    saveInLocalStorage(newNoteTitle, newNoteContent)
    createNewNoteVisually(lastNoteId, newNoteTitle, newNoteContent)
   
    }
    return;

}
//guardar en LocalStorage
function saveInLocalStorage(noteTitle, noteContent) {
    const note = {
        title: noteTitle,
        content: noteContent,
        checked: "false",
    }
    localStorage.setItem(lastNoteId, JSON.stringify(note))
}
//crear la nota visualmente
function createNewNoteVisually(notaId, noteTitle, noteContent, checked) {
    let newNote = newNoteHTML(notaId, noteTitle, noteContent, checked)
    contenedorNotas.insertAdjacentHTML("afterbegin", newNote);
}



// ESCUCHAR CAMBIOS EN NOTAS
function listenChangesInNotes(e) {
    const noteTarget = e.target.closest(".note")
    const idNote = noteTarget.dataset.id
    const isEditable = noteTarget.dataset.editable
    const targetNodeName = e.target.nodeName.toLowerCase();
    if (e.target.classList.contains("remove")) { removeNote(noteTarget, idNote); return }
    if (e.target.classList.contains("save")) { updateNote(noteTarget, idNote); return }
    if (targetNodeName === "input" && e.target.type === "checkbox") { checkNote(noteTarget, idNote); return }
    if (isEditable == "false") { convertToEditable(noteTarget, idNote) }

}
//TO EDITABLE
function convertToEditable(noteHTML, noteId) {
    const titleHTMLTextContent = noteHTML.querySelector(".title").textContent
    const contentHTMLTextContent = noteHTML.querySelector(".content").textContent
    noteHTML.outerHTML = newNoteHTMLEditable(noteId, titleHTMLTextContent, contentHTMLTextContent)

}
//UPDATE
function updateNote(noteHTML, idNote) {
    //Obtener los nuevos título y contenido de los inputs
    const inputTitleValue = noteHTML.querySelector(".title").value
    const inputContentValue = noteHTML.querySelector(".content").value
    //cambiar valores en local storage
    localStorageUpdate(idNote, inputTitleValue, inputContentValue)
    //cambiar visualmente
    //cambiar data-editable y cambiar los inputs por los textos normales
    visualUpdate(noteHTML, idNote, inputTitleValue, inputContentValue)

}
//
function localStorageUpdate(idNote, newTitle, newContent, checked) {
    noteObject = JSON.parse(localStorage.getItem(idNote))
    noteObject.title = newTitle || noteObject.title
    noteObject.content = newContent || noteObject.content
    noteObject.checked = checked || noteObject.checked
    localStorage.setItem(idNote, JSON.stringify(noteObject))
}
//
function visualUpdate(noteHTML, idNote, title, content) {
    noteHTML.outerHTML = newNoteHTML(idNote, title, content)
}
//DELETE
function removeNote(noteHTML, idNote) {
    noteHTML.remove()
    localStorage.removeItem(idNote)
}



//
//FUNCIONES DE FILTRADO
//
function filterNotes(e) {
    if (e.target.nodeName.toLowerCase() == "input" && e.target.type === "text") { fiterBySearch(); return }
    if (e.target.nodeName.toLowerCase() == "input" && e.target.type === "checkbox") { fiterBySearch() }
}
function fiterBySearch() {
    const searchValue = btnSearch.value
    const checkboxValue = checkboxSearch.checked
    const notes = document.querySelectorAll('.note')
    notes.forEach(note => {
        const title = getTitle(note)
        const content = getContent(note)
        if (title.includes(searchValue) || content.includes(searchValue)) {
            note.classList.remove("disabled")
        } else { note.classList.add("disabled") }
        if (checkboxValue == true) {
            //si la nota no está checkeada, entonces no se muestra
            if (note.dataset.checked == "false") {
                note.classList.add("disabled")
            }
        }
    })
}


//MOSTRAR COMO HECHA / NO HECHA
function checkNote(noteHTML, idNote) {
    const noteObject = getNoteOfLocalStorage(idNote)
    if (noteObject.checked == "true") {
        localStorageUpdate(idNote, undefined, undefined, "false")
        noteHTML.dataset.checked = false
    }
    else {
        localStorageUpdate(idNote, undefined, undefined, "true")
        noteHTML.dataset.checked = true
    }

}




//OTROS
//generar plantilla HTML de la nota NO EDITABLE(devuelve un HTML en formato string)
function newNoteHTML(noteId, title, content, checked) {
    let newNote =
        `<div class="note " data-id="${noteId}" data-editable="false" data-checked="${checked || false}">
        <div>
            <h2 class="title">${title}</h2>
            <p class="content">${content || ""}</p>
        </div>
        <input type="checkbox" class="checkbox" ${checked == "true" ? "checked" : ""}>
        
        </div>
    `
    return newNote
}
//generar plantilla HTML de la nota EDITABLE
function newNoteHTMLEditable(noteId, title, content) {
    let newNote =
        `<div class="note" data-id="${noteId}" data-editable="true">
            <input type="text" value="${title}" placeholder="Titulo" class="title">
            <input type="text" value="${content}" placeholder="descripción" class="content">
            
            <div class="buttons">
                <button class="btn remove">
                <span class="icon remove"></span>
                </button>
                <button class="btn save">Guardar
                <span class="icon save"></span>
                </button>
            </div>
        </div>
        `
    return newNote
}
function getTitle(HTMLNote) {
    const title = HTMLNote.querySelector(".title").textContent
    return title
}
function getContent(HTMLNote) {
    const content = HTMLNote.querySelector(".content").textContent
    return content
}
function getNoteOfLocalStorage(idNote) {
    return JSON.parse(localStorage.getItem(idNote))
}
