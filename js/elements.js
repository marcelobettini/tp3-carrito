const tableContainerEl = document.getElementById("table-container")
let tbodyEl = document.createElement("tbody");
let theadEl = document.createElement("thead");
let tableEl = document.createElement("table")
const shoppingListEl = document.getElementById("shoppingList");
const itemQttyEl = document.createElement("p");
const totalEl = document.getElementById("total");
const btnEmptyEl = document
  .getElementById("btnEmpty")
  .addEventListener("click", cancelCart);
const modalBodyEl = document.getElementById("modal-body");
const btnConfirmEl = document
  .getElementById("btnConfirm")
  .addEventListener("click", modalLoad);
const modalCancelEl = document
  .getElementById("modalCancel")
  .addEventListener("click", modalClear);
const modalConfirmEl = document
  .getElementById("modalConfirm")
  .addEventListener("click", modalConfirm);
  const loaderEl = document.querySelector(".loader");