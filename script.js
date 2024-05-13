const modal = document.querySelector('.modal-container');
const tbody = document.querySelector('tbody');
const sName = document.querySelector('#m-name');
const sRole = document.querySelector('#m-role');
const sSalary = document.querySelector('#m-salary');
const btnSave = document.querySelector('#btnSave');

let items;
let id;

const baseUrl = 'http://localhost:3000/users';

const getItemsBD = async () => {
  try {
    const response = await axios.get(baseUrl);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

const setItemsBD = async (items) => {
  try {
    await axios.put(baseUrl, items);
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

function openModal(edit = false, index = 0) {
  console.log("openModal() is called.");

  modal.classList.add('active');

  modal.onclick = e => {
    if (e.target.className.indexOf('modal-container') !== -1) {
      modal.classList.remove('active');
    }
  };

  if (edit) {
    sName.value = items[index].name;
    sRole.value = items[index].role;
    sSalary.value = items[index].salary;
    id = index;
  } else {
    sName.value = '';
    sRole.value = '';
    sSalary.value = '';
  }
}

function editItem(index) {
  console.log("edit is called.");
  openModal(true, index);
}

function deleteItem(index) {
  console.log("deleteItem() function is called. Data is deleted ... ");

  const deletedItemId = items[index].id; 
  axios.delete(`${baseUrl}/${deletedItemId}`) 
    .then(() => {
      items.splice(index, 1); 
      loadItems(); 
    })
    .catch(error => console.error('Error deleting item:', error));
}


function insertItem(item, index) {
  console.log("item", item);
  console.log("index", index);

  let tr = document.createElement('tr');

  tr.innerHTML = `
    <td class="data"><span class="math-inline">${index + 1}</td\>
<td class="data" style="text-transform: uppercase;"></span>${item.name}</td>
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

btnSave.onclick = async (e) => {
  if (sName.value === '' || sRole.value === '' || sSalary.value === '') {
    return;
  }

  e.preventDefault();

  if (id !== undefined) {
    const updatedItem = { ...items[id], name: sName.value, role: sRole.value, salary: sSalary.value };
    console.log(updatedItem);
    try {

      await axios.put(`${baseUrl}/${updatedItem.id}`, updatedItem);
      items[id] = updatedItem;
    } catch (error) {
      console.error('Error updating item:', error);
    }
  } else {
    const newItem = { name: sName.value, role: sRole.value, salary: sSalary.value };
    try {
      await axios.post(baseUrl, newItem);
      items.push(newItem);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  }

  loadItems();
  modal.classList.remove('active');
  id = undefined;
};

function loadItems() {
  getItemsBD()
    .then(data => {
      items = data;
      tbody.innerHTML = '';
      items.forEach((item, index) => {
        insertItem(item, index);
      });
    })
    .catch(error => console.error('Error loading items:', error));
}

loadItems();
