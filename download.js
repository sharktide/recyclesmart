document.getElementById('windowsButton').addEventListener('click', () => {
    // Function to send the fetch request and handle the redirect
    function redirectToUrlwindows() {
        fetch('https://sharktide-recycleai-latest-windows.hf.space/url')  // Replace with your URL
        .then(response => response.json())    // Parse the response as JSON
        .then(data => {
            if (data.url) {
            window.location.href = data.url;  // Redirect the user to the URL from the response
            } else {
            console.error('URL not found in response');
            }
        })
        .catch(error => {
            console.error('Error fetching URL:', error);
        });
    }
    
    // Call the function
    redirectToUrlwindows();
    
        
});

document.getElementById('zippedButton').addEventListener('click', () => {
    // Function to send the fetch request and handle the redirect
    function redirectToUrlzipped() {
        fetch('https://sharktide-recycleai-latest-windows.hf.space/zipped/url')  // Replace with your URL
        .then(response => response.json())    // Parse the response as JSON
        .then(data => {
            if (data.url) {
            window.location.href = data.url;  // Redirect the user to the URL from the response
            } else {
            console.error('URL not found in response');
            }
        })
        .catch(error => {
            console.error('Error fetching URL:', error);
        });
    }
    
    // Call the function
    alert("Coming Soon!")
    
        
});

document.getElementById('macButton').addEventListener('click', () => {
    // Function to send the fetch request and handle the redirect
    function redirectToUrlmac() {
        fetch('https://sharktide-recycleai-latest-windows.hf.space/mac-arm/url')  // Replace with your URL
        .then(response => response.json())    // Parse the response as JSON
        .then(data => {
            if (data.url) {
            window.location.href = data.url;  // Redirect the user to the URL from the response
            } else {
            console.error('URL not found in response');
            }
        })
        .catch(error => {
            console.error('Error fetching URL:', error);
        });
    }
    
    // Call the function
    alert("This application is unisgned. You may have to bypass gatekeeper to use this.")
    redirectToUrlmac()
});

document.getElementById('iosButton').addEventListener('click', () => {
    // Function to send the fetch request and handle the redirect
    function redirectToUrlios() {
        fetch('https://sharktide-recycleai-latest-windows.hf.space/ios/url')  // Replace with your URL
        .then(response => response.json())    // Parse the response as JSON
        .then(data => {
            if (data.url) {
            window.location.href = data.url;  // Redirect the user to the URL from the response
            } else {
            console.error('URL not found in response');
            }
        })
        .catch(error => {
            console.error('Error fetching URL:', error);
        });
    }
    
    // Call the function
    alert("Coming Soon!")
    
        
});

document.getElementById('androidButton').addEventListener('click', () => {
    // Function to send the fetch request and handle the redirect
    function redirectToUrlandroid() {
        fetch('https://sharktide-recycleai-latest-windows.hf.space/android/url')  // Replace with your URL
        .then(response => response.json())    // Parse the response as JSON
        .then(data => {
            if (data.url) {
            window.location.href = data.url;  // Redirect the user to the URL from the response
            } else {
            console.error('URL not found in response');
            }
        })
        .catch(error => {
            console.error('Error fetching URL:', error);
        });
    }
    
    // Call the function
    alert("Coming Soon!")
    
        
});
