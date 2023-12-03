// script.js
document.addEventListener('DOMContentLoaded', function() {
    fetchAndDisplayInventory();
});

document.getElementById('inventory-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const itemName = document.getElementById('item-name').value;
    const itemQuantity = document.getElementById('item-quantity').value;

    fetch('http://localhost:8000', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: itemName, quantity: itemQuantity }),
    })
    .then(response => response.json())
    .then(data => {
        fetchAndDisplayInventory();
        addItemToTable(itemName, itemQuantity);
        document.getElementById('item-name').value = '';
        document.getElementById('item-quantity').value = '';
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

function addItemToTable(name, quantity) {
    const table = document.getElementById('inventory-table').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow(table.rows.length);

    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);
    const cell3 = newRow.insertCell(2);

    cell1.textContent = name;
    cell2.textContent = quantity;
    cell3.innerHTML = '<button onclick="removeItem(this)">削除</button>';
}

function removeItem(btn) {
    const row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
}

function fetchAndDisplayInventory() {
    fetch('http://localhost:8000')
    .then(response => response.json())
    .then(data => {
        updateInventoryTable(data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function updateInventoryTable(data) {
    const tableBody = document.getElementById('inventory-table').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // テーブルをクリア
    data.forEach(item => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = item[0]; // アイテム名
        row.insertCell(1).textContent = item[1]; // 数量
        const deleteButton = row.insertCell(2);
        deleteButton.innerHTML = '<button onclick="removeItem(this)">削除</button>';
    });
}
