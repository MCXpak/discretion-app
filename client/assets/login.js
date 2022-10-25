document.getElementById("login-form").addEventListener("submit", async (e) => {

    e.preventDefault();

    const form = new FormData(e.target);

    const options = {
        method: "POST",
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: form.get("username"),
            password: form.get("password")
        })
    }

    const response = await fetch("http://localhost:3000/users/login", options);
    if (response.status == 200) {
        const data = await response.json();
        console.log(data.token)
        window.location.assign("./board.html");
    } else {
        alert(`Error: ${error}`);
    }

})
