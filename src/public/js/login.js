const form = document.getElementById('loginForm');

form.addEventListener('submit', e => {
    e.preventDefault();

    const data = new FormData(form);

    const obj = {};

    data.forEach((value, key) => (obj[key] = value));

    const fetchParams = {
        url: '/auth',
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
        console.log('Respuesta del servidor:', data);
    
        if (data.redirect) {
            const { first_name, last_name } = data; // Manejo de respuesta inesperada
            Swal.fire({
                icon: 'success',
                title: `¡Bienvenido, ${first_name || ''} ${last_name || ''}!`,
                text: data.message,
            }).then(() => {
                window.location.href = '/profile';
            });
        } else {
            // Mostrar SweetAlert de error
            Swal.fire({
                icon: 'error',
                title: 'Error de autenticación',
                text: data.message,
            });
        }
    });
});

document.getElementById("signupButton").addEventListener("click", function () {
    window.location.href = '/signup';
});
