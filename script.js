function addRow() {
    const table = document.getElementById('invoiceTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    newRow.innerHTML = `
        <td><input type="text" class="item" required></td>
        <td><input type="number" class="quantity" min="1" value="1" oninput="calculateTotal(this)" required></td>
        <td><input type="number" class="price" min="0.01" step="0.01" oninput="calculateTotal(this)" required></td>
        <td><span class="total">0.00</span></td>
        <td><button type="button" class="remove-item" onclick="removeRow(this)">Delete</button></td>
    `;
}

function removeRow(button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
    updateGrandTotal();
}

function calculateTotal(element) {
    const row = element.parentNode.parentNode;
    const quantity = row.querySelector('.quantity').value;
    const price = row.querySelector('.price').value;
    const total = quantity * price;
    row.querySelector('.total').textContent = total.toFixed(2);
    updateGrandTotal();
}

function updateGrandTotal() {
    let grandTotal = 0;
    document.querySelectorAll('.total').forEach(total => {
        grandTotal += parseFloat(total.textContent);
    });
    document.getElementById('grandTotal').textContent = grandTotal.toFixed(2);
}

function generatePDF() {
    const companyDetails = {
        name: document.getElementById('companyName').value,
        address: document.getElementById('companyAddress').value,
        email: document.getElementById('companyEmail').value
    };
    const rows = Array.from(document.querySelectorAll('#invoiceTable tbody tr')).map(row => {
        return {
            item: row.querySelector('.item').value,
            quantity: row.querySelector('.quantity').value,
            price: row.querySelector('.price').value,
            total: row.querySelector('.total').textContent
        };
    });
    const grandTotal = document.getElementById('grandTotal').textContent;

    const data = {
        companyDetails,
        rows,
        grandTotal
    };

    fetch('/.netlify/functions/generate_invoice', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.blob())
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'invoice.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
    })
    .catch(error => console.error('Error generating PDF:', error));
}
