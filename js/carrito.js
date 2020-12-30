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
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      productos = data;
      buildTable(productos);
    });
}

//construye la tabla
function buildTable(data) {
  const keyArray = getKeys(data);
  buildThead(keyArray);
  data.forEach((e) => {
    buildTableRows(e);
  });
  tableEl.append(tbodyEl);
}
//extrae las claves de un JSON y las retorna en un array
function getKeys(data) {
  return Object.keys(data[0]);
}
//construye el table head y tantas celdas header como claves haya en el array generado con getKeys()
function buildThead(keyArray) {
  let theadEl = document.createElement("thead");
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
  const btnShop = document.createElement("button"); //agrega btn Shop y su handler
  const txtShop = document.createTextNode("Comprar");
  btnShop.classList.add("btn", "btn-success", "btn-sm", "m-1");
  btnShop.appendChild(txtShop);
  btnShop.dataset.id = Number(data.id);
  if (data.stock <= 0) {
    btnShop.disabled = true;
  }
  trEl.appendChild(btnShop);
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
  });
}

function printCart() {
  const shoppingList = document.getElementById("shoppingList");
  let total = null;
  cartItem.forEach((el) => {
    const itemEl = document.createElement("p");
    itemEl.innerText = `${el.item} ${el.marca} / ${el.presentacion} / $${el.precio} Cant: ${el.qtty}`;
    total += el.precio * el.qtty;
    totalEl.innerText = total;
    console.log(itemEl);
    console.log(totalEl.innerText);
    shoppingList.appendChild(itemEl);
  });
}

function refreshCart() {
  shoppingList.querySelectorAll("p").forEach((node) => node.remove());
  totalEl.innerText = null;
}

function cancelCart() {
  refreshCart();
  cartItem = [];
}

function modalLoad() {
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

function modalClear() {
  modalBodyEl.querySelectorAll("p").forEach((node) => node.remove());
  totalEl.innerText = null;  
  cancelCart();  
}
window.onload = getJSON();
