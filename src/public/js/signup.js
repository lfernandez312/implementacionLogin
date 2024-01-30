const form = document.getElementById('signupForm');

form.addEventListener('submit', e => {
  e.preventDefault();

  const data = new FormData(form);
  const obj = {};

  data.forEach((value, key) => (obj[key] = value));

  const fetchParams = {
    url: '/users',
    headers: {
      'Content-type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(obj),
  };

  fetch(fetchParams.url, {
    headers: fetchParams.headers,
    method: fetchParams.method,
    body: fetchParams.body,
  })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        // User created successfully
        Swal.fire({
          icon: 'success',
          title: data.message,
        }).then(() => {
          // Redirect to /login after the SweetAlert is closed
          window.location.href = '/login';
        });
      } else if (data.status === 'error' && data.message.includes('email already exists')) {
        // Email already exists
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Email already exists. Please use a different email address.',
        });
      } else {
        // Other error
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.message,
        });
      }
    })
    .catch(error => console.error('Error:', error));
});
