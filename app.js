
//01) Muestra por consola el uso de storage
async function usoIndexedDB() {
  const estimate = await navigator.storage.estimate()
  console.log(estimate)
}

//02) Inicializa IndexedDB
async function creaDb(nombreDB,nombreTabla,id='id') {
  await idb.openDb(nombreDB, 1, db => {
    db.createObjectStore(nombreTabla, {keyPath: id})
  })
}

//03) Rellena una tabla con datos de un json
async function jsonToIndexedDB(nombreDB,nombreTabla) {
  const url = `https://jsonplaceholder.typicode.com/users`
  const response = await fetch(url)
  const datos = await response.json()
  const db = await idb.openDb(nombreDB)
  for(const dato of datos){
    const tx = db.transaction(nombreTabla, 'readwrite')
    await tx.objectStore(nombreTabla).add(dato)
  }
}

//04) Muestra el contenido de IndexedDB
async function listaDb(nombreDB,nombreTabla) {
  const listadoDb = document.querySelector('#listadoDb')
  const db = await idb.openDb(nombreDB)
  const tx = db.transaction(nombreTabla)
  const datos = tx.objectStore(nombreTabla)
  const listadoDatos  = await datos.getAll()

  //Obtiene los nombres de las llaves en keysSet
  const keys = listadoDatos.reduce((acc, item) => [...acc, ...Object.keys(item)], [])
  const keysSet = Array.from(new Set(keys))
  let contenidoTabla = `<table width="80%"><thead><tr>`
  keysSet.forEach(elemento => {
    contenidoTabla += `<th>${elemento}</th>`
  })
  contenidoTabla += `</tr></thead><tbody>`
  for(const dato of listadoDatos){
    contenidoTabla += `<tr>`
    keysSet.forEach(elemento => {
      contenidoTabla += `<td>${dato[elemento]}</td>`
    })
    contenidoTabla += `</tr>`
  }
  contenidoTabla += `</tbody></table>`
  listadoDb.innerHTML = contenidoTabla
}

//05) Limpia IndexedDB
async function limpiarDb(nombreDB,nombreTabla) {
  const db = await idb.openDb(nombreDB)
  const tx = db.transaction(nombreTabla, 'readwrite')
  await tx.objectStore(nombreTabla).clear()
}
//06) Borra Db
async function borrarDb(nombreDB) {
  window.indexedDB.deleteDatabase(nombreDB)
}