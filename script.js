document.addEventListener('DOMContentLoaded', () => {
    // Get references to HTML elements
    const ifscInput = document.getElementById('ifscCode');
    const resultDiv = document.getElementById('result');
    const loader = document.getElementById('loader');
    
    let debounceTimeout;

    // Function to fetch details from the API
    const fetchDetails = async () => {
        const ifscCode = ifscInput.value.trim();

        // IFSC code must be 11 characters long
        if (ifscCode.length !== 11) {
            resultDiv.style.display = 'none'; // Hide result div if input is not valid
            resultDiv.innerHTML = '';
            return;
        }
        
        // Show the loader and hide previous results
        loader.style.display = 'block';
        resultDiv.style.display = 'none';
        resultDiv.classList.remove('error');

        try {
            // Razorpay's reliable and fast API endpoint
            const apiUrl = `https://ifsc.razorpay.com/${ifscCode}`;
            
            const response = await fetch(apiUrl);
            
            // Handle HTTP errors like 404 (Not Found)
            if (response.status === 404) {
                throw new Error('Invalid IFSC Code. Please check and try again.');
            }

            if (!response.ok) {
                throw new Error('An unexpected error occurred. Please try again later.');
            }

            const data = await response.json();
            displayResult(data);

        } catch (error) {
            console.error('Fetch error:', error);
            // Display a user-friendly error message from the caught error
            displayError(error.message);
        } finally {
            // Always hide the loader after the operation
            loader.style.display = 'none';
        }
    };

    // Function to display the successful result
    const displayResult = (data) => {
        resultDiv.style.display = 'block';
        resultDiv.classList.remove('error');
        resultDiv.innerHTML = `
            <p><strong>Bank:</strong> ${data.BANK}</p>
            <p><strong>IFSC:</strong> ${data.IFSC}</p>
            <p><strong>Branch:</strong> ${data.BRANCH}</p>
            <p><strong>Address:</strong> ${data.ADDRESS}</p>
            <p><strong>City:</strong> ${data.CITY}</p>
            <p><strong>State:</strong> ${data.STATE}</p>
            <p><strong>Contact:</strong> ${data.CONTACT ? `<a href="tel:${data.CONTACT}">${data.CONTACT}</a>` : 'Not Available'}</p>
        `;
    };

    // Function to display an error message
    const displayError = (message) => {
        resultDiv.style.display = 'block';
        resultDiv.classList.add('error');
        resultDiv.innerHTML = `<p>${message}</p>`;
    };
    
    // Debounce function to limit API calls while user is typing
    const debounceFetch = () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(fetchDetails, 300); // 300ms delay for faster response
    };

    // Add event listener to the input field
    ifscInput.addEventListener('input', debounceFetch);
});