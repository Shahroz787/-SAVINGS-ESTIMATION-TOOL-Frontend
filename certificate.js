
// Function to fetch and display certificate data
async function fetchCertificateData() {
    try {
        const response = await fetch('http://localhost:8080/getCertificates');

        if (response.ok) {
            const data = await response.json();
            const certificates = data.certificates;

            const certificateList = document.getElementById('certificateList');
            certificateList.innerHTML = ''; // Clear existing data

            if (certificates.length === 0) {
                certificateList.innerHTML = '<p>No certificates found.</p>';
            } else {
                certificates.forEach((certificate) => {
                    const certificateDiv = document.createElement('div');
                    certificateDiv.classList.add('certificate-item');

                    // Display certificate data
                    certificateDiv.innerHTML = `
                        <p><strong>Certificate ID:</strong> ${certificate._id}</p>
                        <p><strong>Amount:</strong> ₹${certificate.amount}</p>
                        <p><strong>Interest Rate:</strong> ${certificate.interestRate}%</p>
                        <p><strong>Purchase Date:</strong> ${certificate.purchaseDate}</p>
                        <button class="edit-button" data-id="${certificate._id}" >Edit</button>
                        <button class="delete-button" data-id="${certificate._id}">Delete</button>
                    `;

                    certificateList.appendChild(certificateDiv);
                });
            }
        } else {
            console.error('Error fetching certificate data');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Add event listener to fetch and display certificate data when the page loads
window.addEventListener('load', () => {
    fetchCertificateData();
});

// Handle edit and delete button clicks
document.getElementById('certificateList').addEventListener('click', (event) => {
    const target = event.target;

    if (target.classList.contains('edit-button')) {
        // Handle edit button click
        const certificateID = target.getAttribute('data-id');
        editCertificate(certificateID);
    } else if (target.classList.contains('delete-button')) {
        // Handle delete button click
        const certificateID = target.getAttribute('data-id');
        deleteCertificate(certificateID);
    }
});


// Function to edit a certificate
async function editCertificate(certificateID) {
    try {
        // Fetch the certificate details from the server
        const response = await fetch(`http://localhost:8080/getCertificate/${certificateID}`);
        if (response.ok) {
            const data = await response.json();
            const certificate = data.certificate;

            console.log('Certificate details:', certificate);

            // Populate the edit form with the certificate details
            document.getElementById('editCertificateID').value = certificate._id;
            document.getElementById('editCertificateAmount').value = certificate.amount;
            document.getElementById('editInterestRate').value = certificate.interestRate;

            // Convert and set the date in the correct format
            const inputDate = new Date(certificate.purchaseDate);
            const year = inputDate.getFullYear();
            const month = (inputDate.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
            const day = inputDate.getDate().toString().padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            document.getElementById('editPurchaseDate').value = formattedDate;

            // Show the edit overlay
            const editOverlay = document.getElementById('editOverlay');
            editOverlay.style.display = 'block';

        } else {
            console.error('Error fetching certificate details');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}



async function submitEditedCertificate() {
    const certificateID = document.getElementById('editCertificateID').value;
    const updatedAmount = parseFloat(document.getElementById('editCertificateAmount').value);
    const updatedInterestRate = parseFloat(document.getElementById('editInterestRate').value);
    const updatedPurchaseDate = new Date(document.getElementById('editPurchaseDate').value);

    // console.log("your submit button push")

    try {
        const response = await fetch(`http://localhost:8080/editCertificate/${certificateID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: updatedAmount,
                interestRate: updatedInterestRate,
                purchaseDate: updatedPurchaseDate,
            }),
        });

        if (response.status === 200) {
            // Certificate successfully edited, edit form ko hide karen
            document.getElementById('editOverlay').style.display = 'none';

            // Certificate list ko refresh karen
            await fetchCertificateData(); // async/await here as well
        } else {
            const data = await response.json();
            alert(data.error);
        }
    } catch (error) {
        console.error('Certificate edit mein error:', error);
    }
}

// Function to cancel the edit operation
async function cancelEdit() {
    document.getElementById('editOverlay').style.display = 'none';
}

// Function to close the edit overlay
async function closeEditModal() {
    const editOverlay = document.getElementById('editOverlay');
    editOverlay.style.display = 'none';
}




// Function to delete a certificate
async function deleteCertificate(certificateID) {
    try {
        const response = await fetch(`http://localhost:8080/deleteCertificate/${certificateID}`, {
            method: 'DELETE',
        });

        if (response.status === 200) {
            // Certificate deleted successfully
            fetchCertificateData(); // Refresh the certificate list
            console.log('Certificate deleted successfully.');
        } else {
            const data = await response.json();
            alert(data.error);
        }
    } catch (error) {
        console.error('Error deleting certificate:', error);
    }
}


