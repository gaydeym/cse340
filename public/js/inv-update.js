const form = document.querySelector("#updateForm");
form.addEventListener("change", function () {
    const update = document.querySelector('#updateForm input[type="submit"]');
    update.removeAttribute("disabled");
});
