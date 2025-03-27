document.getElementById('windowsButton').addEventListener('click', () => {
    // Function to send the fetch request and handle the redirect
    function redirectToUrlwindows() {
        fetch('https://sharktide-recycleai-latest-windows.hf.space/url')
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
        fetch('https://sharktide-recycleai-latest-windows.hf.space/zipped/url')
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
    
    window.location.href = 'https://github.com/sharktide/recycleAI-desktop-windows/releases/download/v1.2.1/win-unpacked.zip'
    
        
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
    window.location.href = "https://github.com/sharktide/recycleAI-desktop-macOS/releases/download/v1.2.1/RecycleAI.macOS-1.2.1-arm64.dmg";
});

document.getElementById('iosButton').addEventListener('click', () => {
    // Function to send the fetch request and handle the redirect
    function redirectToUrlios() {
        fetch('https://sharktide-recycleai-latest-windows.hf.space/ios/url')
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
        fetch('https://sharktide-recycleai-latest-windows.hf.space/android/url')
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
