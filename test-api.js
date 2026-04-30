fetch('https://tealeafluxe.onrender.com/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Admin', email: 'admin@tealeaf.com', password: 'password123', confirmPassword: 'password123' })
})
.then(res => res.json().then(data => console.log('Status:', res.status, 'Body:', data)))
.catch(err => console.error(err));
