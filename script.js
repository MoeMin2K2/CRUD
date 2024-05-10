const modal = document.querySelector('.modal-container')
const tbody = document.querySelector('tbody')
const sName = document.querySelector('#m-name')
const sRole = document.querySelector('#m-role')
const sSalary = document.querySelector('#m-salary')
const btnSave = document.querySelector('#btnSave')
const searchBar = document.querySelector('#searchTerm')

let items
let id

function openModal(edit = false, index = 0) {

  console.log("openModal() is called.");

  modal.classList.add('active')

  modal.onclick = e => {
    if (e.target.className.indexOf('modal-container') !== -1) {
      modal.classList.remove('active')
    }
  }

  if (edit) {
    sName.value = items[index].name
    sRole.value = items[index].role
    sSalary.value = items[index].salary
    id = index
  } else {
    sName.value = ''
    sRole.value = ''
    sSalary.value = ''
  }
  
}

function editItem(index) {
  console.log("edit is called.");
  openModal(true, index)
}

function deleteItem(index) {
  console.log("deleteItem() function is called. Data is deleted ... ")
  items.splice(index, 1)
  setItemsBD()
  loadItems()
}

function insertItem(item, index) {

  console.log("item", item);
  console.log("index",index);

  let tr = document.createElement('tr');

  tr.innerHTML = `
    <td class="data">${index + 1}</td>
    <td class="data" style="text-transform: uppercase;">${item.name}</td>
    <td class="data">${item.role}</td>
    <td class="data">MMK ${item.salary}</td>
    <td class="action">
      <button onclick="editItem(${index})"><i class='bx bx-edit' ></i></button>
    </td>
    <td class="action">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `;
  tbody.appendChild(tr);
  console.log("Data Table is set ...");
}

btnSave.onclick = e => {

  if (sName.value == '' || sRole.value == '' || sSalary.value == '') {
    return;
  }

  e.preventDefault();

  if (id !== undefined) {
    items[id].name = sName.value
    items[id].role = sRole.value
    items[id].salary = sSalary.value
  } else {
    console.log("Data saved!",items);
    items.push({'name': sName.value, 'role': sRole.value, 'salary': sSalary.value});
  }

  setItemsBD();

  modal.classList.remove('active');
  loadItems();
  id = undefined;
}

function loadItems() {
  items = getItemsBD();
  tbody.innerHTML = '';
  items.forEach((item, index) => {
    insertItem(item, index);
  })

}

const getItemsBD = () => JSON.parse(localStorage.getItem('dbfunc')) ?? [];
const setItemsBD = () => localStorage.setItem('dbfunc', JSON.stringify(items));

loadItems();

// function searchEmployees() {
//   const searchTerm = searchBar.value.toLowerCase();
//   const filteredItems = items.filter(item => item.name.toLowerCase().includes(searchTerm));
//   tbody.innerHTML = '';
//   filteredItems.forEach((item, index) => {
//     insertItem(item, index);
//   });
// }

// searchBar.addEventListener('keyup', searchEmployees);