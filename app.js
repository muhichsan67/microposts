// Storage Controller
const StorageCtrl = (function () {

  // Public Methods
  return {
    storeItem: (item) => {
      let items
      //  Check if any items in LS
      if (localStorage.getItem('items') === null) {
        items = [];
        // Push new item
        items.push(item);

        // Set LS 
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        // Get what is already in LS
        items = JSON.parse(localStorage.getItem('items'));

        // Push new item
        items.push(item);

        // Reset LS
        localStorage.setItem('items', JSON.stringify(items));
      }
    },
    getItemFromStorage: () => {
      let items;
      if (localStorage.getItem('items') === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },
    updateItemStorage: (updatedItem) => {
      let items = JSON.parse(localStorage.getItem('items'));
      items.forEach((item, index) => {
        if(updatedItem.id === item.id){
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteItemFromStorage: (id) => {
      let items = JSON.parse(localStorage.getItem('items'));
      items.forEach((item, index) => {
        if(id === item.id){
          items.splice(index, 1);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    cleareItemFromStorage: () => {
      localStorage.removeItem('items');
    }
  }
})();

// Item Controller
const ItemCtrl = (function () {
  // Item Constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  // Data Structure / State
  const data = {
    items: StorageCtrl.getItemFromStorage(),
    currentItem: null,
    totalCalories: 0
  }

  return {
    getItems: () => {
      return data.items;
    },
    addItem: (name, calories) => {
      let ID;
      // Create ID
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Calories to number
      calories = parseInt(calories);

      // Create new item
      newItem = new Item(ID, name, calories);
      data.items.push(newItem);

      return newItem;
    },
    getItemsByID: (id) => {
      let found = null;
      // Loop through item
      data.items.forEach((item) => {
        if (item.id === id) {
          found = item;
        }
      })
      return found;
    },
    updateItem: (name, calories) => {
      // Calories to number
      calories = parseInt(calories);

      let found = null;

      data.items.forEach((item) => {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });

      return found;
    },
    deleteItem: (id) => {
      // Get IDs
      const ids = data.items.map((item) => {
        return item.id;
      })

      // Get index
      const index = ids.indexOf(id);

      console.log(index);
      // Remove Item
      data.items.splice(index, 1);
    },
    clearAllItems: () => {
      data.items = [];
    },
    setCurrentItem: (item) => {
      data.currentItem = item;
    },
    getCurrentItem: () => {
      return data.currentItem;
    },
    getTotalCalories: () => {
      let total = 0;

      data.items.forEach((item) => {
        total += item.calories;
      })

      data.totalCalories = total;

      return data.totalCalories;
    },
    logData: () => {
      return data;
    }
  }
})();


// UI Controller
const UICtrl = (function () {
  const UISelectors = {
    itemList: '#item-list',
    listItem: '#item-list li',
    addBtn: '.add-btn',
    editBtn: '.edit-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    itemMealInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
  }

  return {
    populateItemList: (items) => {
      let html = '';

      items.forEach((item) => {
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong>
        <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      </li>`
      });

      // Insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    addItemToForm: () => {
      console.log(ItemCtrl.getCurrentItem().name);
      console.log(ItemCtrl.getCurrentItem().calories);
      document.querySelector(UISelectors.itemMealInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
    },
    deleteListItem: (id) => {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    clearFields: () => {
      document.querySelector(UISelectors.itemMealInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    removeItems: () => {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn Node list into array
      listItems = Array.from(listItems);

      listItems.forEach((item) => {
        item.remove();
      });
    },
    hideList: () => {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showTotalCalories: (totalCalories) => {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    showEditState: () => {
      document.querySelector(UISelectors.addBtn).style.display = 'none';
      document.querySelector(UISelectors.editBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
    },
    clearEditState: () => {
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
      document.querySelector(UISelectors.editBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.itemMealInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    getSelectors: () => {
      return UISelectors;
    },
    addListItem: (item) => {
      document.querySelector(UISelectors.itemList).style.display = 'block';
      // Create li element
      const li = document.createElement('li');
      li.className = 'collection-item';
      li.id = `item-${item.id}`;
      li.innerHTML = `
        <strong>${item.name}: </strong>
        <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      `;

      // Insert Item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
    },
    updateItem: (item) => {
      let listItems = document.querySelectorAll(UISelectors.listItem);

      // Turn Node list into  array
      listItems = Array.from(listItems);

      listItems.forEach((listItem) => {
        const itemID = listItem.getAttribute('id');

        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong>
          <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>`;
        }

      });
    },
    getItemInput: () => {
      return {
        name: document.querySelector(UISelectors.itemMealInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    }
  }

})();


// App Controller
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {
  // Load Event Listeners
  const loadEventListeners = () => {
    // Get UI Selectors
    const UISelectors = UICtrl.getSelectors();

    document.addEventListener('keypress', (e) => {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    // Add Item EventListeners
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    // Edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

    // Update Item Event
    document.querySelector(UISelectors.editBtn).addEventListener('click', itemUpdateSubmit);

    // Delete Item Event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

    // Clear Item Event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);

    // Back Button Event
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);
  }

  const itemAddSubmit = (e) => {
    // Get form input from UI Controller
    const input = UICtrl.getItemInput();

    // Check for name and calories input
    if (input.name !== '' && input.calories !== '') {
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      // Add item to UI
      UICtrl.addListItem(newItem);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Store in LocalStorage
      StorageCtrl.storeItem(newItem);

      // Clear input
      UICtrl.clearFields();

    }

    e.preventDefault();
  }

  // Edit item click
  const itemEditClick = (e) => {
    if (e.target.classList.contains('edit-item')) {
      // Get list item id
      const listID = e.target.parentNode.parentNode.id;
      const listIDArr = listID.split('-');

      const id = parseInt(listIDArr[1]);

      const editItem = ItemCtrl.getItemsByID(id);

      ItemCtrl.setCurrentItem(editItem);

      UICtrl.addItemToForm();
      UICtrl.showEditState();
    }

    e.preventDefault();
  }

  // Update item submit
  const itemUpdateSubmit = (e) => {
    // Get item input
    const input = UICtrl.getItemInput();

    // Update item
    const updateItem = ItemCtrl.updateItem(input.name, input.calories);

    //
    UICtrl.updateItem(updateItem);
    UICtrl.clearEditState();
    UICtrl.clearFields();

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);
    
    StorageCtrl.updateItemStorage(updateItem);

    e.preventDefault();
  }

  // Delete item submit
  const itemDeleteSubmit = (e) => {
    // Get current item
    const currentItem = ItemCtrl.getCurrentItem();

    // Delete from data structure
    ItemCtrl.deleteItem(currentItem.id);

    // Delete from UI
    UICtrl.deleteListItem(currentItem.id);
    UICtrl.clearEditState();

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Delete from localstorage
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    e.preventDefault();
  }

  // Clear items event
  const clearAllItemsClick = () => {
    // Delete all items from data structure
    ItemCtrl.clearAllItems();

    // Remove from UI
    UICtrl.removeItems();

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Clear LS
    StorageCtrl.cleareItemFromStorage();

    // Hide list
    UICtrl.hideList();
  }

  return {
    init: function () {
      console.log('Initializing App..');

      UICtrl.clearEditState();

      const items = ItemCtrl.getItems();

      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        UICtrl.populateItemList(items);
      }

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Load Event Listeners
      loadEventListeners();
    }
  }

})(ItemCtrl, StorageCtrl, UICtrl);

// Init App
App.init();