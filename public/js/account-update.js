const form = document.querySelector("#updateRegistrationForm");
form.addEventListener("change", function () {
    const update = document.querySelector('#updateRegistrationForm input[type="submit"]');
    update.removeAttribute("disabled");
});

const passwordInput = document.querySelector("#account_password");
const passwordHide = document.querySelector("#passwordHide");
passwordHide.addEventListener("click", () => {
    if (passwordInput.getAttribute("type") === "password") {
        passwordInput.setAttribute("type", "text");
        passwordHide.innerText = "Hide password";
    } else {
        passwordInput.setAttribute("type", "password");
        passwordHide.innerText = "Show password";
    }
});
