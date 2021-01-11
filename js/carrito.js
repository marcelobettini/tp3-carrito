"use strict";
const url = "https://5fc82e232af77700165ad172.mockapi.io/api/productos";

let productos = null;
let cartItem = [];
let id = null;
let idCheck = null;

function getJSON() {
  fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    // .then(function (response) {
    //   return response.json();
    // })
    .then((data) => {
      productos = data;
      buildTable(productos);
    });
}

//construye la tabla
function buildTable(data) {
  tableEl.classList.add("table", "table-dark");
  tableContainerEl.append(tableEl);
  const keyArray = getKeys(data);
  buildThead(keyArray);
  data.forEach((e) => {
    buildTableRows(e);
  });
}
//extrae las claves de un JSON y las retorna en un array
function getKeys(data) {
  return Object.keys(data[0]);
}
//construye el table head y tantas celdas header como claves haya en el array generado con getKeys()
function buildThead(keyArray) {
  for (let key in keyArray) {
    let thEl = document.createElement("th");
    thEl.innerHTML = keyArray[key].toUpperCase();
    theadEl.appendChild(thEl);
    tableEl.appendChild(theadEl);
  }
}
//construye body (rows) de tabla tomando contenido de array que se le pasa
function buildTableRows(data) {
  const trEl = document.createElement("tr");
  for (let key in data) {
    let tdEl = document.createElement("td");
    tdEl.innerHTML = data[key];
    trEl.appendChild(tdEl);
    tbodyEl.appendChild(trEl);
  }
  const btnShop = document.createElement("button");
  const txtShop = document.createTextNode("Comprar");
  btnShop.classList.add("btn", "btn-success", "btn-sm", "m-1");
  btnShop.appendChild(txtShop);
  btnShop.id = "btnShop";
  btnShop.dataset.id = Number(data.id);
  if (data.stock <= 0) {
    btnShop.disabled = true;
  }
  trEl.appendChild(btnShop);
  tableEl.appendChild(tbodyEl);
  btnShop.addEventListener("click", (ev) => {
    id = ev.target.dataset.id;
    idCheck = id;
    const item = productos[ev.target.dataset.id - 1].item;
    const marca = productos[ev.target.dataset.id - 1].marca;
    const presentacion = productos[ev.target.dataset.id - 1].presentacion;
    const precio = productos[ev.target.dataset.id - 1].precio;
    const qtty = 1;
    const newItem = { id, item, marca, presentacion, precio, qtty };
    let idx = cartItem.findIndex((element) => {
      return element.id == id;
    });
    if (idx == -1) {
      cartItem.push(newItem);
      refreshCart();
      printCart();
    } else {
      cartItem[idx].qtty += 1;
      refreshCart();
      printCart();
    }
    updateStock(id-1, btnShop, "minus");
  });
}

//actualiza stock provisoriamente en la tabla (no en el array ni en la base de datos)
function updateStock(id, btnShop, operation) {
  if (tableEl.rows[id].cells[5].innerText == 0) {
    btnShop.disabled = true;
  } else {
    switch (operation) {
      case "minus":
        tableEl.rows[id].cells[5].innerText -= 1;
        break;
      case "plus":
        let num = Number(tableEl.rows[id].cells[5].innerText);
        tableEl.rows[id].cells[5].innerText = num + 1;
        break;
      default:
    }
  }
}

//carga el carrito
function printCart() {
  let total = null;
  cartItem.forEach((el) => {
    const itemContainer = document.createElement("div"); //div contenedor de línea de carrito
    itemContainer.className = "item-container";
    const cartlineTxt = document.createElement("div"); //div hijo, contiene producto en un <p>
    cartlineTxt.className = "cartline-text";
    cartlineTxt.innerText = `${el.item} ${el.marca} / ${el.presentacion} / $${el.precio} Cant: ${el.qtty}`;
    const cartlineBtn = document.createElement("div"); //div hijo, contiene botones más y menos
    cartlineBtn.classList.add("btn-group", "btn-group-sm", "btn-alert"); //clase Bootstrap p/ grupo de botones
    cartlineBtn.setAttribute("role", "group");
    cartlineBtn.setAttribute("aria-label", "botones + y -");
    const btnPlus = document.createElement("button"); //botón agregar unidad a producto en carrito
    btnPlus.className = "btn";
    btnPlus.id = "btnPlus";
    const btnPlusTxt = document.createTextNode("+");
    btnPlus.appendChild(btnPlusTxt);
    const btnMinus = document.createElement("button"); //botón restar unidad a producto en carrito
    btnMinus.className = "btn";
    btnMinus.id = "btnMinus";
    const btnMinusTxt = document.createTextNode("-");
    btnMinus.appendChild(btnMinusTxt);
    cartlineBtn.appendChild(btnPlus);
    cartlineBtn.appendChild(btnMinus);
    itemContainer.appendChild(cartlineTxt);
    itemContainer.appendChild(cartlineBtn);
    total += el.precio * el.qtty;
    totalEl.innerText = total;
    cartBody.appendChild(itemContainer);
    btnPlus.dataset.id = cartItem.indexOf(el); //asigno a dataset-id de cada botón index del array carrito
    btnMinus.dataset.id = cartItem.indexOf(el);
  });
}

//funcionalidad de botones + y - PERO: queda enganchado con el último en la actualización
function detectBtn(e) {
  e.preventdefault;
  console.log(e.target.id)    
  console.log(cartItem[e.target.dataset.id].id)
   
  switch (e.target.id) {    
    case "btnMinus":
      if (cartItem[e.target.dataset.id].qtty == 1) {        
        cartItem.splice(e.target.dataset.id, 1)
        refreshCart();
        printCart();           
        updateStock(cartItem[e.target.dataset.id].id-1, btnShop, "plus");
      } else {
        cartItem[e.target.dataset.id].qtty -= 1;
        refreshCart();
        printCart();        
        updateStock(cartItem[e.target.dataset.id].id-1, btnShop, "plus");
      }
      break;
    case "btnPlus":
      cartItem[e.target.dataset.id].qtty += 1;
      refreshCart();
      printCart();      
      updateStock(cartItem[e.target.dataset.id].id-1, btnShop, "minus");
      break;
    default:
  }
}
//limpia el carrito
function refreshCart() {
  cartBody.querySelectorAll("div").forEach((node) => node.remove());
  totalEl.innerText = null;
}
//cancela la compra
function cancelCart() {
  refreshCart();
  cartItem.forEach((e) => {
    tableEl.rows[e.id - 1].cells[5].innerText = productos[e.id - 1].stock;
  });
  cartItem = [];
}

//carga los productos del carrito en el modal
function modalLoad() {
  const modalConfirmEl = document.getElementById("modalConfirm");
  if (cartItem.length == 0) {
    modalConfirmEl.disabled = true;
  } else {
    modalConfirmEl.disabled = false;
  }
  let total = null;
  cartItem.forEach((el) => {
    const itemMdl = document.createElement("p");
    itemMdl.innerText = `${el.item} ${el.marca} / ${el.presentacion} / $${el.precio} Cant: ${el.qtty}`;
    total += el.precio * el.qtty;
    totalEl.innerText = total;
    modalBodyEl.appendChild(itemMdl);
  });
  modalBodyEl.appendChild(totalEl);
}

//limpia el modal
function modalClear() {
  modalBodyEl.querySelectorAll("p").forEach((node) => node.remove());
  totalEl.innerText = null;
  cancelCart();
}

//confirma la compra
function modalConfirm() {
  cartItem.forEach((e) => {
    editStock(e.id, tableEl.rows[e.id - 1].cells[5].innerText);
  });
  tableEl.remove();
  cancelCart();
  modalClear();
  tableEl = null;
  theadEl = null;
  tbodyEl = null;
  tableEl = document.createElement("table");
  theadEl = document.createElement("thead");
  tbodyEl = document.createElement("tbody");
  loader();
}

//actualiza stock en el JSON original
function editStock(index, stock) {
  const slash = "/";
  const id = productos[index - 1].id;
  const combinedURL = url.concat(slash + id);
  fetch(combinedURL, {
    method: "PUT",
    body: JSON.stringify({
      stock: stock,
    }),
    headers: { "Content-Type": "application/JSON" },
  })
    .then((response) => response.json())
    .catch((err) => {
      //el catch no estaba en el original, lo puse para debuguear pero no encontré error
      console.log("error: ", err);
    });
  console.log("fetch ", id);
}
function loader() {
  loaderEl.classList.toggle("hidden");
  setTimeout(() => {
    getJSON();
    loaderEl.classList.toggle("hidden");
    clearTimeout();
  }, 2000);
}
window.onload = getJSON();
