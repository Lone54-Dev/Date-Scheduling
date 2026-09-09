(function () {

    "use strict";


    /* ========================================
       ELEMENTS
    ======================================== */

    const deck = document.getElementById("Place-Deck");
    const indicators = document.getElementById("Place-Indicators");
    const gamePage = document.getElementById("Game-Page");
    const placeConversation = document.getElementById("Place-Conversation");
    const placeDialogue = document.getElementById("Place-Dialogue");
    const placeYes = document.getElementById("Place-Yes");
    const placeNo = document.getElementById("Place-No");
    const placeAvatar = document.getElementById("Place-Avatar-Image");

    if (!deck) {
        return;
    }


    /* ========================================
       STORAGE
    ======================================== */

    const DATE_PLAN_KEY = "datePlannerState";
    const ADMIN_PLACES_KEY = "dateAppAdminPlaces";
    const AVATAR_NORMAL_KEY = "dateAppAvatar_normal";
    const AVATAR_HAPPY_KEY = "dateAppAvatar_happy";


    const defaultDatePlan = {
        date: null,
        time: null,
        formattedDate: null,
        formattedTime: null,
        place: null,
        dateComplete: false,
        placeComplete: false,
        sendComplete: false,
        senderName: "",
        receiverEmail: ""
    };


    function getDatePlan() {

        try {

            const saved = JSON.parse(
                localStorage.getItem(DATE_PLAN_KEY)
            );

            return {
                ...defaultDatePlan,
                ...(saved || {})
            };

        } catch (error) {

            console.error("Unable to read date plan:", error);

            return {
                ...defaultDatePlan
            };

        }

    }


    function saveDatePlan(plan) {

        try {

            localStorage.setItem(
                DATE_PLAN_KEY,
                JSON.stringify(plan)
            );

        } catch (error) {

            console.error("Unable to save date plan:", error);

        }

    }


    /* ========================================
       DEFAULT PLACES
    ======================================== */

    const defaultPlaces = [

        {
            id: "dreamy-cafe",
            name: "Dreamy Café",
            image: "places/coffee.jpg",
            short: "A cozy little café where we can eat, talk, and spend time together.",
            full: "A cute and relaxing café where we can sit down, order something good, take pictures, and spend a few hours just talking about random things.",
            budget: "₱500 - ₱800",
            activities: "Eat, talk, take pictures",
            vibe: "Cozy & romantic"
        },

        {
            id: "sunset-park",
            name: "Sunset Park",
            image: "places/park.jpg",
            short: "A peaceful place where we can watch the sunset together.",
            full: "A relaxing outdoor date where we can walk around, sit together, watch the sunset, and enjoy a quiet moment away from everything.",
            budget: "₱200 - ₱500",
            activities: "Walk, talk, watch sunset",
            vibe: "Peaceful & sweet"
        },

        {
            id: "arcade-night",
            name: "Arcade Date",
            image: "places/arcade.jpg",
            short: "Games, friendly competition, photobooth, and probably a little cheating. 😌",
            full: "A fun arcade date where we can play games, compete against each other, win tickets, and laugh at how competitive we both get.",
            budget: "₱500 - ₱1,000",
            activities: "Play games, compete, picture, eat",
            vibe: "Fun & playful"
        },

        {
            id: "house-date",
            name: "House Date",
            image: "places/house.jpg",
            short: "A relaxing bonding day with good food and even better company.",
            full: "A simple house date where we can talk, take pictures, eat together, and watch videos.",
            budget: "₱500 - ₱1,000",
            activities: "Talk, watch videos, eat, take pictures",
            vibe: "Relaxing & romantic"
        },

        {
            id: "museum-date",
            name: "Museum Date",
            image: "places/museum.jpg",
            short: "A relaxing stroll together around a museum.",
            full: "A musem date where we can arts, take pictures, eat together, and enjoy the scenic and beautiful arts.",
            budget: "₱500 - ₱1,000",
            activities: "Walk, talk, eat, take pictures",
            vibe: "Relaxing & romantic"
        }

    ];


    function loadPlaces() {

        try {

            const saved = localStorage.getItem(ADMIN_PLACES_KEY);

            if (!saved) {

                const seededPlaces = defaultPlaces.map(place => ({ ...place }));

                localStorage.setItem(
                    ADMIN_PLACES_KEY,
                    JSON.stringify(seededPlaces)
                );

                return seededPlaces;

            }

            const parsed = JSON.parse(saved);

            if (!Array.isArray(parsed) || parsed.length === 0) {

                const seededPlaces = defaultPlaces.map(place => ({ ...place }));

                localStorage.setItem(
                    ADMIN_PLACES_KEY,
                    JSON.stringify(seededPlaces)
                );

                return seededPlaces;

            }

            return parsed
                .filter(place => (
                    place &&
                    typeof place === "object" &&
                    typeof place.name === "string" &&
                    place.name.trim() !== ""
                ))
                .map((place, index) => ({
                    id: place.id || `admin-place-${index + 1}`,
                    name: place.name || "Unnamed Place",
                    image: place.image || "places/placeholder1.jpg",
                    short: place.short || "A lovely place for our date.",
                    full: place.full || place.short || "A lovely place where we can spend time together.",
                    budget: place.budget || "Not specified",
                    activities: place.activities || "Spend time together",
                    vibe: place.vibe || "Sweet & romantic"
                }));

        } catch (error) {

            console.error("Unable to load admin places:", error);

            return defaultPlaces.map(place => ({ ...place }));

        }

    }


    let places = loadPlaces();


    /* ========================================
       STATE
    ======================================== */

    let currentIndex = 0;
    let isShuffling = false;
    let longPressTimer = null;
    let longPressInterval = null;
    let longPressTriggered = false;
    const HOLD_DURATION = 800;
    let placeTypingID = 0;
    let placeConfirmed = false;
    let currentExpandedCard = null;
    let currentBackdrop = null;
    let currentConversationParent = null;


    /* ========================================
       AVATARS
    ======================================== */

    const defaultAvatarNormal = "character/asking_avatar.png";
    const defaultAvatarHappy = "character/happy_avatar.png";


    function getAvatar(key, fallback) {

        try {
            return localStorage.getItem(key) || fallback;
        } catch (error) {
            return fallback;
        }

    }


    function getNormalAvatar() {
        return getAvatar(AVATAR_NORMAL_KEY, defaultAvatarNormal);
    }


    function getHappyAvatar() {
        return getAvatar(AVATAR_HAPPY_KEY, defaultAvatarHappy);
    }


    /* ========================================
       KEEP PAGE SHARP
    ======================================== */

    function keepPlacesPageSharp() {

        if (!gamePage) {
            return;
        }

        gamePage.classList.remove("blurred");

        gamePage.style.setProperty(
            "filter",
            "none",
            "important"
        );

    }


    keepPlacesPageSharp();


    /* ========================================
       SAFE HTML
    ======================================== */

    function escapeHTML(value) {

        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");

    }


    /* ========================================
       CREATE CARDS
    ======================================== */

    function createCards() {

        if (places.length === 0) {
            currentIndex = 0;
        } else if (currentIndex >= places.length) {
            currentIndex = 0;
        }

        deck.innerHTML = "";

        if (indicators) {
            indicators.innerHTML = "";
        }


        if (places.length === 0) {

            const emptyCard = document.createElement("div");

            emptyCard.className = "Place-Card is-front";

            emptyCard.innerHTML = `
                <div class="Place-Info">
                    <h2 class="Place-Name">No places yet 💕</h2>
                    <p class="Place-Short-Description">
                        The admin hasn't added any date places yet.
                    </p>
                </div>
            `;

            deck.appendChild(emptyCard);

            keepPlacesPageSharp();

            return;
        }


        places.forEach(function (place, index) {

            const card = document.createElement("div");

            card.className = "Place-Card";
            card.dataset.index = index;

            const image = escapeHTML(place.image);
            const name = escapeHTML(place.name);
            const shortDescription = escapeHTML(place.short);
            const fullDescription = escapeHTML(place.full);
            const budget = escapeHTML(place.budget);
            const activities = escapeHTML(place.activities);
            const vibe = escapeHTML(place.vibe);

            card.innerHTML = `
                <button
                    type="button"
                    class="Place-Close"
                    aria-label="Close"
                >
                    ×
                </button>

                <div class="Place-Image-Container">
                    <img
                        class="Place-Image"
                        src="${image}"
                        alt="${name}"
                        onerror="this.onerror=null;this.src='places/placeholder1.jpg';"
                    >
                </div>

                <div class="Place-Info">

                    <h2 class="Place-Name">
                        ${name}
                    </h2>

                    <p class="Place-Short-Description">
                        ${shortDescription}
                    </p>

                    <div class="Place-Full-Description">

                        <p>
                            ${fullDescription}
                        </p>

                        <div class="Place-Details">

                            <div>
                                <strong>💰 Budget</strong>
                                <span>${budget}</span>
                            </div>

                            <div>
                                <strong>🍴 What we can do</strong>
                                <span>${activities}</span>
                            </div>

                            <div>
                                <strong>💕 Date vibe</strong>
                                <span>${vibe}</span>
                            </div>

                        </div>

                    </div>

                    <div class="Long-Press-Container">
                        <div class="Long-Press-Progress"></div>
                        <span>
                            Hold / long press the card to view full
                        </span>
                    </div>

                </div>
            `;

            deck.appendChild(card);


            if (indicators) {

                const indicator = document.createElement("button");

                indicator.type = "button";
                indicator.className = "Place-Indicator";
                indicator.dataset.index = index;

                indicator.setAttribute(
                    "aria-label",
                    `Go to ${place.name}`
                );

                indicator.addEventListener(
                    "click",
                    function (event) {

                        event.stopPropagation();

                        goToPlace(index);

                    }
                );

                indicators.appendChild(indicator);

            }

        });

        updateDeck();

    }


    /* ========================================
       UPDATE DECK
    ======================================== */

    function updateDeck() {

        const cards = Array.from(
            deck.querySelectorAll(".Place-Card")
        );


        if (places.length === 0) {

            cards.forEach(card => {
                card.classList.remove(
                    "is-second",
                    "is-third",
                    "is-hidden"
                );
                card.classList.add("is-front");
            });

            keepPlacesPageSharp();
            return;
        }


        cards.forEach(function (card, index) {

            const position = (
                index - currentIndex + places.length
            ) % places.length;

            card.classList.remove(
                "is-front",
                "is-second",
                "is-third",
                "is-hidden"
            );

            if (position === 0) {
                card.classList.add("is-front");
            } else if (position === 1) {
                card.classList.add("is-second");
            } else if (position === 2) {
                card.classList.add("is-third");
            } else {
                card.classList.add("is-hidden");
            }

        });


        if (indicators) {

            const dots = Array.from(
                indicators.querySelectorAll(".Place-Indicator")
            );

            dots.forEach(function (dot, index) {

                dot.classList.toggle(
                    "active",
                    index === currentIndex
                );

            });

        }

        keepPlacesPageSharp();

    }


    /* ========================================
       SHUFFLE
    ======================================== */

    function shuffle(direction) {

        if (isShuffling) {
            return;
        }

        if (places.length <= 1) {
            return;
        }

        const frontCard = deck.querySelector(
            ".Place-Card.is-front"
        );

        if (!frontCard) {
            return;
        }

        isShuffling = true;

        deck.classList.add("is-shuffling");

        frontCard.classList.add(
            direction === "left"
                ? "shuffle-left"
                : "shuffle-right"
        );

        setTimeout(function () {

            currentIndex = (
                currentIndex + 1
            ) % places.length;

            frontCard.classList.remove(
                "shuffle-left",
                "shuffle-right"
            );

            updateDeck();

        }, 300);

        setTimeout(function () {

            deck.classList.remove("is-shuffling");
            isShuffling = false;

        }, 650);

    }


    /* ========================================
       CARD CLICK
    ======================================== */

    deck.addEventListener(
        "click",
        function (event) {

            const card = event.target.closest(
                ".Place-Card"
            );

            if (!card) {
                return;
            }

            if (
                event.target.closest(
                    ".Place-Close"
                )
            ) {
                return;
            }

            if (longPressTriggered) {

                longPressTriggered = false;
                return;

            }

            if (
                !card.classList.contains(
                    "is-front"
                )
            ) {
                return;
            }

            if (places.length <= 1) {
                return;
            }

            shuffle("left");

        }
    );


    /* ========================================
       LONG PRESS
    ======================================== */

    function startLongPress(event) {

        const card = event.target.closest(
            ".Place-Card"
        );

        if (!card) {
            return;
        }

        if (
            !card.classList.contains(
                "is-front"
            )
        ) {
            return;
        }

        if (
            event.target.closest(
                ".Place-Close"
            )
        ) {
            return;
        }

        if (isShuffling || places.length === 0) {
            return;
        }

        cancelLongPress();

        longPressTriggered = false;

        const progress = card.querySelector(
            ".Long-Press-Progress"
        );

        if (!progress) {
            return;
        }

        const startTime = performance.now();

        longPressInterval = setInterval(function () {

            const elapsed =
                performance.now() - startTime;

            const percentage = Math.min(
                (elapsed / HOLD_DURATION) * 100,
                100
            );

            progress.style.width =
                percentage + "%";

        }, 16);

        longPressTimer = setTimeout(function () {

            longPressTriggered = true;

            cancelLongPress();

            expandCard(card);

        }, HOLD_DURATION);

    }


    function cancelLongPress() {

        if (longPressTimer) {

            clearTimeout(longPressTimer);
            longPressTimer = null;

        }

        if (longPressInterval) {

            clearInterval(longPressInterval);
            longPressInterval = null;

        }

        const progress = deck.querySelector(
            ".Long-Press-Progress"
        );

        if (progress) {
            progress.style.width = "0%";
        }

    }


    deck.addEventListener(
        "pointerdown",
        startLongPress
    );

    deck.addEventListener(
        "pointerup",
        cancelLongPress
    );

    deck.addEventListener(
        "pointercancel",
        cancelLongPress
    );

    deck.addEventListener(
        "pointerleave",
        cancelLongPress
    );


    /* ========================================
       EXPAND CARD
    ======================================== */

    function expandCard(card) {

        if (
            card.classList.contains(
                "expanded"
            )
        ) {
            return;
        }

        const conversationParent =
            placeConversation
                ? placeConversation.parentElement
                : null;

        currentConversationParent =
            conversationParent;

        currentExpandedCard = card;

        document.body.appendChild(card);

        if (placeConversation) {
            document.body.appendChild(placeConversation);
        }

        const backdrop = document.createElement("div");

        backdrop.className = "Place-Backdrop";
        currentBackdrop = backdrop;

        document.body.appendChild(backdrop);

        requestAnimationFrame(function () {
            backdrop.classList.add("visible");
        });

        card.classList.add("expanded");

        document.body.style.overflow = "hidden";

        placeConfirmed = false;
        placeTypingID++;

        if (placeDialogue) {
            placeDialogue.textContent = "Pick place card?";
        }

        if (placeAvatar) {
            placeAvatar.classList.remove("talking");
            placeAvatar.src = getNormalAvatar();
        }

        if (placeYes) {
            placeYes.disabled = false;
        }

        if (placeNo) {
            placeNo.disabled = false;
        }

        if (placeConversation) {

            placeConversation.classList.remove("exit-right");
            placeConversation.classList.add("visible");

        }

        const closeButton = card.querySelector(
            ".Place-Close"
        );

        if (closeButton) {

            closeButton.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();
                    closeCurrentPlaceCard();

                },
                { once: true }
            );

        }

        backdrop.addEventListener(
            "click",
            closeCurrentPlaceCard,
            { once: true }
        );

    }


    /* ========================================
       CLOSE CURRENT CARD
    ======================================== */

    function closeCurrentPlaceCard() {

        if (!currentExpandedCard) {
            return;
        }

        const card = currentExpandedCard;
        const backdrop = currentBackdrop;

        placeTypingID++;

        card.classList.remove("expanded");

        if (placeConversation) {
            placeConversation.classList.remove("visible");
            placeConversation.classList.remove("exit-right");
        }

        if (placeAvatar) {
            placeAvatar.classList.remove("talking");
            placeAvatar.src = getNormalAvatar();
        }

        if (typeof window.stopTalkingSFX === "function") {
            window.stopTalkingSFX();
        }

        if (placeDialogue) {
            placeDialogue.textContent = "Pick place card?";
        }

        placeConfirmed = false;

        if (placeYes) {
            placeYes.disabled = false;
        }

        if (placeNo) {
            placeNo.disabled = false;
        }

        deck.style.pointerEvents = "";
        document.body.style.overflow = "";

        deck.appendChild(card);

        if (
            placeConversation &&
            currentConversationParent
        ) {
            currentConversationParent.appendChild(
                placeConversation
            );
        }

        updateDeck();

        if (backdrop) {

            backdrop.classList.remove("visible");

            setTimeout(function () {

                if (backdrop.isConnected) {
                    backdrop.remove();
                }

            }, 250);

        }

        currentExpandedCard = null;
        currentBackdrop = null;
        currentConversationParent = null;

    }


    /* ========================================
       GO TO PLACE
    ======================================== */

    function goToPlace(index) {

        if (isShuffling) {
            return;
        }

        if (
            index < 0 ||
            index >= places.length
        ) {
            return;
        }

        currentIndex = index;
        updateDeck();

    }


    /* ========================================
       TYPE DIALOGUE
    ======================================== */

    function typePlaceDialogue(text) {

        return new Promise(function (resolve) {

            placeTypingID++;

            const currentTypingID = placeTypingID;

            if (!placeDialogue) {
                resolve();
                return;
            }

            placeDialogue.classList.add("change");

            setTimeout(function () {

                if (
                    currentTypingID !==
                    placeTypingID
                ) {
                    resolve();
                    return;
                }

                placeDialogue.textContent = "";
                placeDialogue.classList.remove("change");

                if (placeAvatar) {
                    placeAvatar.classList.add("talking");
                }

                if (typeof window.startTalkingSFX === "function") {
                    window.startTalkingSFX();
                }

                let i = 0;

                function typeCharacter() {

                    if (
                        currentTypingID !==
                        placeTypingID
                    ) {

                        if (placeAvatar) {
                            placeAvatar.classList.remove("talking");
                        }

                        if (typeof window.stopTalkingSFX === "function") {
                            window.stopTalkingSFX();
                        }

                        resolve();
                        return;

                    }

                    if (i < text.length) {

                        placeDialogue.textContent +=
                            text.charAt(i);

                        i++;

                        setTimeout(
                            typeCharacter,
                            45
                        );

                    } else {

                        if (placeAvatar) {
                            placeAvatar.classList.remove("talking");
                        }

                        if (typeof window.stopTalkingSFX === "function") {
                            window.stopTalkingSFX();
                        }

                        resolve();

                    }

                }

                typeCharacter();

            }, 180);

        });

    }


    /* ========================================
       NO
    ======================================== */

    if (placeNo) {

        placeNo.addEventListener(
            "click",
            async function () {

                if (placeConfirmed) {
                    return;
                }

                placeNo.disabled = true;

                if (placeYes) {
                    placeYes.disabled = true;
                }

                await typePlaceDialogue(
                    "Okay... maybe another one 💕"
                );

                if (placeConversation) {
                    placeConversation.classList.add(
                        "exit-right"
                    );
                }

                await wait(750);

                closeCurrentPlaceCard();

            }
        );

    }


    /* ========================================
       YES
    ======================================== */

    if (placeYes) {

        placeYes.addEventListener(
            "click",
            async function () {

                if (placeConfirmed) {
                    return;
                }

                if (!currentExpandedCard) {
                    return;
                }

                const selectedPlace = places[currentIndex];

                if (!selectedPlace) {
                    return;
                }

                placeConfirmed = true;

                placeYes.disabled = true;

                if (placeNo) {
                    placeNo.disabled = true;
                }

                deck.style.pointerEvents = "none";

                await typePlaceDialogue(
                    "Place confirmed, Cant wait!!!!"
                );

                if (placeAvatar) {
                    placeAvatar.classList.remove("talking");
                    placeAvatar.src = getHappyAvatar();
                }

                const plan = getDatePlan();

                plan.place = selectedPlace.name;
                plan.placeComplete = true;

                /*
                 * Selecting a new place makes the old
                 * send state invalid because the plan
                 * contents have changed.
                 */
                plan.sendComplete = false;

                saveDatePlan(plan);

                window.dispatchEvent(
                    new CustomEvent(
                        "datePlaceSelected",
                        {
                            detail: {
                                place: selectedPlace.name
                            }
                        }
                    )
                );

                await wait(450);

                if (placeConversation) {
                    placeConversation.classList.add(
                        "exit-right"
                    );
                }

                await wait(750);

                closeCurrentPlaceCard();

                await wait(250);

                window.location.href = "index.html";

            }
        );

    }


    /* ========================================
       WAIT
    ======================================== */

    function wait(milliseconds) {

        return new Promise(resolve => {
            setTimeout(resolve, milliseconds);
        });

    }


    /* ========================================
       REFRESH PLACES
    ======================================== */

    function refreshPlaces() {

        if (currentExpandedCard) {
            closeCurrentPlaceCard();
        }

        places = loadPlaces();

        if (places.length === 0) {
            currentIndex = 0;
        } else if (currentIndex >= places.length) {
            currentIndex = 0;
        }

        isShuffling = false;
        longPressTriggered = false;

        createCards();
        keepPlacesPageSharp();

    }


    /* ========================================
       ADMIN UPDATE EVENT
    ======================================== */

    window.addEventListener(
        "dateAppPlacesUpdated",
        function () {
            refreshPlaces();
        }
    );


    /* ========================================
       STORAGE EVENT
    ======================================== */

    window.addEventListener(
        "storage",
        function (event) {

            if (event.key === ADMIN_PLACES_KEY) {
                refreshPlaces();
            }

            if (event.key === AVATAR_NORMAL_KEY) {

                if (
                    placeAvatar &&
                    !placeConfirmed
                ) {
                    placeAvatar.src = getNormalAvatar();
                }

            }

            if (event.key === AVATAR_HAPPY_KEY) {

                if (
                    placeAvatar &&
                    placeConfirmed
                ) {
                    placeAvatar.src = getHappyAvatar();
                }

            }

        }
    );


    /* ========================================
       AVATAR UPDATE EVENT
    ======================================== */

    window.addEventListener(
        "dateAppAvatarUpdated",
        function (event) {

            const detail = event.detail || {};
            const avatarType = detail.type || detail.key || "";

            if (!placeAvatar) {
                return;
            }

            if (
                avatarType === "normal" ||
                avatarType === "all"
            ) {

                if (!placeConfirmed) {
                    placeAvatar.src = getNormalAvatar();
                }

            }

            if (
                avatarType === "happy" ||
                avatarType === "all"
            ) {

                if (placeConfirmed) {
                    placeAvatar.src = getHappyAvatar();
                }

            }

        }
    );


    /* ========================================
       INITIALIZE
    ======================================== */

    createCards();
    keepPlacesPageSharp();

})();
