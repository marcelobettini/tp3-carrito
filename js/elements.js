const tbodyEl = document.createElement("tbody");
const tableEl = document.getElementById("table");
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
