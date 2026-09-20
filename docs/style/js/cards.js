document.addEventListener("DOMContentLoaded", () => {
    initStudyCards();
});

document.addEventListener("DOMContentSwitch", () => {
    initStudyCards();
});


function initStudyCards() {

    const cards = Array.from(
        document.querySelectorAll(".study-card")
    );

    if (cards.length === 0) return;


    /* 防止 MkDocs instant navigation 重复插入 */
    if (document.querySelector(".card-navigation")) return;


    let currentIndex = 0;


    const navigation = document.createElement("div");

    navigation.className = "card-navigation";

    navigation.innerHTML = `
        <button id="prev-card">← 上一张</button>

        <span id="card-counter">
            1 / ${cards.length}
        </span>

        <button id="next-card">下一张 →</button>
    `;


    cards[0].parentNode.insertBefore(
        navigation,
        cards[0]
    );


    const counter =
        navigation.querySelector("#card-counter");


    function updateCurrentCard(index) {

        currentIndex = Math.max(
            0,
            Math.min(index, cards.length - 1)
        );


        cards.forEach(card => {
            card.classList.remove("active-card");
        });


        const current = cards[currentIndex];

        current.classList.add("active-card");


        current.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });


        counter.textContent =
            `${currentIndex + 1} / ${cards.length}`;
    }


    navigation
        .querySelector("#prev-card")
        .addEventListener("click", () => {
            updateCurrentCard(currentIndex - 1);
        });


    navigation
        .querySelector("#next-card")
        .addEventListener("click", () => {
            updateCurrentCard(currentIndex + 1);
        });


    /* 键盘左右方向键 */
    document.addEventListener("keydown", event => {

        if (event.key === "ArrowRight") {
            updateCurrentCard(currentIndex + 1);
        }

        if (event.key === "ArrowLeft") {
            updateCurrentCard(currentIndex - 1);
        }

    });


    /*
     * 用户自己滚动页面时，
     * 自动判断当前浏览的是哪张卡
     */

    const observer = new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                const index =
                    cards.indexOf(entry.target);

                if (index === -1) return;

                currentIndex = index;

                counter.textContent =
                    `${index + 1} / ${cards.length}`;

                cards.forEach(card => {
                    card.classList.remove("active-card");
                });

                entry.target.classList.add(
                    "active-card"
                );

            });

        },

        {
            threshold: 0.55
        }

    );


    cards.forEach(card => {
        observer.observe(card);
    });


    updateCurrentCard(0);
}