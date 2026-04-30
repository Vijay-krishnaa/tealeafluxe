fetch("https://tealeafluxe.onrender.com/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "admin@tealeaf.com", password: "Tealeaf@Admin831013" })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
