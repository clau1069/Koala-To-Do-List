/* APLICACIÓN DE NOTAS.
- Se debe poder crear y eliminar notas.
- La aplicación debe contar con un filtro para buscar por texto.
- También debe tener un filtro por checkbox para ver sólo las completadas.
- Los filtros tienen que funcionar combinados.
- Las notas tienen que persistir al recargar la página ( localStorage) */

//DOM
const btnCreateNew = document.getElementById("btn-create-new")
const inputCreateNoteTitle = document.getElementById("input-create-note-title")
const inputCreateNoteContent = document.getElementById("input-create-note-content")
const contenedorNotas = document.getElementById('contenedor-notas');
/* const btnRemove = document.getElementsByClassName("remove") */
const btnSearch = document.getElementById("input-search")
const checkboxSearch = document.getElementById("checkbox-search")
const formSearch = document.getElementById("search")
const bottomSheetForm = document.getElementById("bottom-sheet")
const closeBtn = document.getElementById("close-bottom-sheet")
const floatingBtnCreate = document.getElementById("btn-flotante-crear")


let localStorageKeys = Object.keys(localStorage).sort(function (a, b) {
    return a - b
})
let lastNoteId = localStorageKeys[localStorageKeys.length - 1] || 0

// Notas Precargadas
saveInLocalStorage ("Ideas para el blog", "Escribir sobre consejos de productividad, reseñas de libros y tutoriales de diseño gráfico.")
saveInLocalStorage ("Películas para ver", "Anotar 'The Shawshank Redemption', 'Inception' y 'La La Land' en la lista de películas pendientes.")
saveInLocalStorage ("Tareas pendientes", " - Responder correos electrónicos\n- Terminar el informe del proyecto\n- Preparar la reunión con el cliente\n- Actualizar el calendario de eventos")
saveInLocalStorage ("Ideas para el proyecto", "- Investigar tecnologías\n- Diseñar la interfaz de usuario\n- Planificar la arquitectura del sistema\n- Definir las funcionalidades principales")



//EVENTOS
document.addEventListener("DOMContentLoaded", loadNotes())

btnCreateNew.addEventListener("click", createNewNote)
contenedorNotas.addEventListener("click", listenChangesInNotes)
contenedorNotas.addEventListener("input", autoResizeTextarea)
formSearch.addEventListener("input", filterNotes)
closeBtn.addEventListener("click", closeBottomSheet)
floatingBtnCreate.addEventListener("click", revealBottomSheet)
inputCreateNoteContent.addEventListener("input", autoResizeTextarea)
inputCreateNoteTitle.addEventListener("keydown", writeDescription)



//FUNCIONES
//cargarNotas
function loadNotes() {
    console.log("loadNotes");
    localStorageKeys.forEach((id) => {
        let notaObject = JSON.parse(localStorage.getItem(id))
        let titleString = notaObject.title
        let contentString = notaObject.content
        let checked = notaObject.checked
        createNewNoteVisually(id, titleString, contentString, checked)
    })
}




//FUNCIONES PARA CREAR
function closeBottomSheet() {
    console.log(closeBottomSheet);
    bottomSheetForm.classList.add("disabled")
    floatingBtnCreate.classList.remove("disabled")
    console.log(closeBtn);
}
function revealBottomSheet() {
    console.log(revealBottomSheet);
    inputCreateNoteTitle.value = ""
    inputCreateNoteContent.value = ""
    bottomSheetForm.classList.remove("disabled")
    floatingBtnCreate.classList.add("disabled")
    inputCreateNoteTitle.focus()
}
function writeDescription(e) {
    if (e.key === "Enter") {
        e.preventDefault()
        inputCreateNoteContent.focus()
    }
}
function createNewNote(e) {
    console.log(createNewNote);
    e.preventDefault()
    if (bottomSheetForm.checkValidity()) {
        lastNoteId++
        let newNoteTitle = inputCreateNoteTitle.value
        let newNoteContent = inputCreateNoteContent.value
        saveInLocalStorage(newNoteTitle, newNoteContent)
        createNewNoteVisually(lastNoteId, newNoteTitle, newNoteContent)
        closeBottomSheet()
    }

    return;

}
//guardar en LocalStorage
function saveInLocalStorage(noteTitle, noteContent) {
    console.log(saveInLocalStorage);
    const note = {
        title: noteTitle,
        content: noteContent,
        checked: "false",
    }
    localStorage.setItem(lastNoteId, JSON.stringify(note))
}
//crear la nota visualmente
function createNewNoteVisually(notaId, noteTitle, noteContent, checked) {
    console.log(createNewNoteVisually);
    let newNote = newNoteHTML(notaId, noteTitle, noteContent, checked)
    contenedorNotas.insertAdjacentHTML("afterbegin", newNote);
}



// ESCUCHAR CAMBIOS EN NOTAS
function listenChangesInNotes(e) {
    console.log(listenChangesInNotes);
    const noteTarget = e.target.closest(".note")
    const idNote = noteTarget.dataset.id
    const isEditable = noteTarget.dataset.editable
    const targetNodeName = e.target.nodeName.toLowerCase();

    if (targetNodeName === "input" && e.target.type === "checkbox") { checkNote(noteTarget, idNote); return }
    if (isEditable == "false") { convertToEditable(noteTarget, idNote); return }
    //funciones del CRUD
    const btnClicked = e.target.closest("button")
    if (btnClicked) {
        if (btnClicked.classList.contains("remove")) { removeNote(noteTarget, idNote); return }
        if (btnClicked.classList.contains("save")) { updateNote(noteTarget, idNote); return }
        if (btnClicked.classList.contains("cancel")) { convertToNoEditable(noteTarget, idNote); return }
    }


}
//TO EDITABLE
function convertToEditable(noteHTML, noteId) {
    console.log(convertToEditable);
    const titleHTMLTextContent = noteHTML.querySelector(".title").textContent
    const contentHTMLTextContent = noteHTML.querySelector(".content").textContent
    const dataChecked = noteHTML.getAttribute('data-checked')
    noteHTML.outerHTML = newNoteHTMLEditable(noteId, titleHTMLTextContent, contentHTMLTextContent, dataChecked)
    autoResizeTextarea()

}
//TO NO EDITABLE
function convertToNoEditable(noteHTML, idNote) {
    noteObject = JSON.parse(localStorage.getItem(idNote))
    const title = noteObject.title
    const content = noteObject.content
    const checked = noteObject.checked
    noteHTML.outerHTML = newNoteHTML(idNote, title, content, checked)
}

//UPDATE
function updateNote(noteHTML, idNote) {
    console.log(updateNote);
    const inputTitleValue = noteHTML.querySelector(".title").value
    const inputContentValue = noteHTML.querySelector(".content").value
    //cambiar valores en local storage
    localStorageUpdate(idNote, inputTitleValue, inputContentValue)
    //cambiar a no editable (visualmente)
    convertToNoEditable(noteHTML, idNote)

}
//
function localStorageUpdate(idNote, newTitle, newContent, checked) {
    console.log(localStorageUpdate);
    noteObject = JSON.parse(localStorage.getItem(idNote))
    noteObject.title = newTitle || noteObject.title
    noteObject.content = newContent || noteObject.content
    noteObject.checked = checked || noteObject.checked
    localStorage.setItem(idNote, JSON.stringify(noteObject))
}

//DELETE
function removeNote(noteHTML, idNote) {
    console.log(removeNote);
    noteHTML.remove()
    localStorage.removeItem(idNote)
}



//
//FUNCIONES DE FILTRADO
//
function filterNotes(e) {
    console.log("filterNotes");
    if (e.target.nodeName.toLowerCase() == "input" && e.target.type === "text") { fiterBySearch(); return }
    if (e.target.nodeName.toLowerCase() == "input" && e.target.type === "checkbox") { fiterBySearch() }
}
function fiterBySearch() {
    console.log("fiterBySearch");
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
    console.log("checkNote");
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
            <input type="checkbox" class="checkbox" ${checked == "true" ? "checked" : ""}>
        </div>
        <p class="content">${content || ""}</p>
        
        
        </div>
    `
    return newNote
}
//generar plantilla HTML de la nota EDITABLE
function newNoteHTMLEditable(noteId, title, content, checked) {
    let newNote =
        `<div class="note" data-id="${noteId}" data-editable="true" data-checked="${checked || false}">
            <input type="text" value="${title}" placeholder="Titulo" class="title">
            <textarea id="textarea-editable-note" placeholder="Descripción" rows="1" class="content">${content}</textarea>

            
            <div class="buttons">
                        <button class="btn remove">
                            <p>Borrar</p>
                            <span class="icon remove"></span>
                        </button>
                        <button class="btn cancel">
                            <p>Cancelar</p>
                            <span class="icon cancel"></span>
                        </button>
                        <button class="btn save">
                            <p>Guardar</p>
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
function autoResizeTextarea(e) {
    let textarea;
    if (e != null && e.target.nodeName == "TEXTAREA") {
        textarea = e.target
    } else {
        textarea = document.getElementById("textarea-editable-note")
        console.log(textarea);
    }
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';

}
//por un lado reasigna el heigth de un textarea. El textarea lo saca del target del evento (solo funciona cuando hay un evento)
//por otro lado reasigna el heigth de un textarea, con un textarea que saca no del evento, sino buscandolo en el DOM