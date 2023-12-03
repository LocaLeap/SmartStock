document.addEventListener('DOMContentLoaded', function() {
    fetchInventoryData();
});

function fetchInventoryData() {
    fetch('http://localhost:8000')
    .then(response => response.json())
    .then(data => {
        updateInventoryTable(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function updateInventoryTable(data) {
    const tableBody = document.getElementById('inventory-table').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';

    data.forEach(item => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = item[1]; // 品名
        const currentWeight = 500; // 現在の重量（モデルケースとして500g）
        const remainingQuantity = Math.round(currentWeight / item[3]); // 残り数量
        row.insertCell(1).textContent = remainingQuantity;
    });
}