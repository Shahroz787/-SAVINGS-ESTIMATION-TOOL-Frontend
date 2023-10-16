// document.getElementById('getTotalSavingsButton').addEventListener('click', function () {
//     console.log('Button clicked'); // Add this line to log the message
//     getTotalSavings();
// });

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';

    // Hide the notification after a few seconds (e.g., 3 seconds)
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000); // 3000 milliseconds = 3 seconds
}

async function getTotalSavings() {
    try {
        const response = await fetch('http://localhost:8080/getTotalSavings');

        if (response.ok) {
            const data = await response.json();
            const totalSavings = data.totalSavings;

            // Update the HTML to display the total savings balance
            document.getElementById('totalSavings').textContent = `Total Savings: ${totalSavings} PKR`;
        } else {
            console.error('Error fetching total savings');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
getTotalSavings();

// Add an event listener to the "Get Total Savings" button
// document.getElementById('getTotalSavingsButton').addEventListener('click', () => {
//     getTotalSavings();
// });

// Add an event listener to the "Withdraw" button
document.getElementById('withdrawButton').addEventListener('click', async () => {
    const amountToWithdraw = parseInt(document.getElementById('withdrawAmount').value);
    if (isNaN(amountToWithdraw)) {
        alert('Please enter a valid amount to withdraw.');
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/withdrawSavings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amountToWithdraw }),
        });

        if (response.status === 200) {
            showNotification('Withdrawal successful.'); // Show a notification on success
            getTotalSavings();
        } else {
            const data = await response.json();
            alert(data.error);
        }
    } catch (error) {
        console.error('Error withdrawing from savings:', error);
    }
});

// Add an event listener to the "Add Certificate" button
document.getElementById('addCertificateButton').addEventListener('click', () => {
    const certificateAmount = parseFloat(document.getElementById("certificateAmount").value);
    const interestRate = parseFloat(document.getElementById("interestRate").value);
    const purchaseDate = document.getElementById("purchaseDate").value;

    if (!isNaN(certificateAmount) && !isNaN(interestRate) && purchaseDate) {
        const certificateData = {
            amount: certificateAmount,
            interestRate,
            purchaseDate,
        };

        // Send the certificate data to the server
        sendCertificateData(certificateData);

        // Clear input fields
        clearInputFields();
    }
});

async function sendCertificateData(certificateData) {
    try {
        const response = await fetch('http://localhost:8080/addCertificate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(certificateData),
        });

        if (response.ok) {
            showNotification('Certificate added successfully.');
            const data = await response.json();
            console.log(data.message); // You can handle the response here
        } else {
            console.error('Error adding certificate');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to clear input fields
function clearInputFields() {
    document.getElementById("certificateAmount").value = '';
    document.getElementById("interestRate").value = '';
    document.getElementById("purchaseDate").value = '';
}


