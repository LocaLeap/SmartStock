// script.js
document.addEventListener('DOMContentLoaded', function() {
    fetchAndDisplayInventory();
});

document.getElementById('inventory-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const itemName = document.getElementById('item-name').value;
    const itemQuantity = document.getElementById('item-quantity').value;

    sendPostRequest(itemName, itemQuantity);
});

function sendPostRequest(itemName, itemQuantity, force = false) {
    fetch('http://localhost:8000', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: itemName, quantity: itemQuantity, force: force }),
    })
    .then(response => {
        if (!response.ok && response.status === 400) {
            // 重複警告のハンドリング
            return response.json().then(data => {
                if (confirm(data.message + " それでも追加しますか？")) {
                    // ユーザーが確認した場合、強制的に追加
                    sendPostRequest(itemName, itemQuantity, true);
                }
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.status === 'received') {
            // 通常の処理
            addItemToTable(itemName, itemQuantity);
            document.getElementById('item-name').value = '';
            document.getElementById('item-quantity').value = '';
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

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
        row.insertCell(0).textContent = item[0]; // 管理番号
        row.insertCell(1).textContent = item[1]; // アイテム名
        row.insertCell(2).textContent = item[2]; // 数量
        row.insertCell(3).textContent = item[3]; // 一個当たりの重量
        const deleteButton = row.insertCell(4);
        deleteButton.innerHTML = '<button onclick="removeItem(this)">削除</button>';
    });
}