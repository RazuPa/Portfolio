const readMoreButtons = document.querySelectorAll(".read-more");

readMoreButtons.forEach(button => {

    button.addEventListener("click", () => {

        const content = button.previousElementSibling;

        content.classList.toggle("active");

        if (content.classList.contains("active")) {
            button.textContent = "Visa mindre";
        } else {
            button.textContent = "Läs mer";
        }

    });

});