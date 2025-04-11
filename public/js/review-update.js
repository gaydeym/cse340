const form = document.querySelector("#updateReviewForm");
form.addEventListener("change", function () {
    const update = document.querySelector('#updateReviewForm input[type="submit"]');
    update.removeAttribute("disabled");
});