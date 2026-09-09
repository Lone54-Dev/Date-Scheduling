// DATE SCHEDULING GAME
// ========================================


// ========================================
// ELEMENTS
// ========================================

const dialog =
    document.getElementById("Dialog");

const noButton =
    document.getElementById("No-btn");

const yesButton =
    document.getElementById("Yes-btn");

const avatar =
    document.querySelector(".avatar img");

const gamePage =
    document.getElementById("Game-Page");

const countdownOverlay =
    document.getElementById("Countdown-Overlay");

const countdownText =
    document.getElementById("Countdown");

const scoreDisplay =
    document.getElementById("Score-Display");

const scoreText =
    document.getElementById("Score");

const finishOverlay =
    document.getElementById("Finish-Overlay");

const finalScoreText =
    document.getElementById("Final-Score");

const finishMessage =
    document.getElementById("Finish-Message");


// ========================================
// SIDEBAR
// ========================================

const sidebar =
    document.getElementById("Sidebar");

const sidebarToggle =
    document.getElementById("Sidebar-Toggle");


if (
    sidebar &&
    sidebarToggle
) {

    sidebarToggle.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle(
                "collapsed"
            );

            document.body.classList.toggle(
                "sidebar-collapsed"
            );

        }
    );

}


const homeButton =
    document.getElementById(
        "Home-Button"
    );

const placesButton =
    document.getElementById(
        "Places-Button"
    );

const settingsButton =
    document.getElementById(
        "Settings-Button"
    );

const settingsOverlay =
    document.getElementById(
        "Settings-Overlay"
    );

const closeSettings =
    document.getElementById(
        "Close-Settings"
    );

const settingsDone =
    document.getElementById(
        "Settings-Done"
    );


// ========================================
// SOUND EFFECTS
// ========================================

const SOUND_ENABLED_KEY =
    "dateAppSoundEnabled";

const SOUND_VOLUME_KEY =
    "dateAppSoundVolume";

const DEFAULT_SOUND_VOLUME =
    0.60;

const SFX_REFERENCE_VOLUME =
    0.50;

const SOUND_FILES = {
    buttonClick: "sfx/button_click.mp3",
    hoverGame: "sfx/hovergame_button.mp3",
    talking: "sfx/talking.mp3"
};

const soundEffects = {
    buttonClick: new Audio(SOUND_FILES.buttonClick),
    hoverGame: new Audio(SOUND_FILES.hoverGame),
    talking: new Audio(SOUND_FILES.talking)
};

soundEffects.buttonClick.preload = "auto";
soundEffects.hoverGame.preload = "auto";
soundEffects.talking.preload = "auto";
soundEffects.talking.loop = true;

function clampAudioVolume(value) {

    return Math.max(
        0,
        Math.min(
            1,
            Number.isFinite(value)
                ? value
                : 0
        )
    );

}

function getStoredVolume(key, fallback) {

    const saved = Number.parseFloat(
        localStorage.getItem(key)
    );

    if (!Number.isFinite(saved)) {
        return fallback;
    }

    return clampAudioVolume(saved);

}

function getSoundVolume() {

    return getStoredVolume(
        SOUND_VOLUME_KEY,
        DEFAULT_SOUND_VOLUME
    );

}

function updateSoundVolumeUI() {

    const slider =
        document.getElementById(
            "Sound-Volume"
        );

    const valueLabel =
        document.getElementById(
            "Sound-Volume-Value"
        );

    const percentage = Math.round(
        getSoundVolume() * 100
    );

    if (slider) {
        slider.value = String(percentage);
        slider.setAttribute(
            "aria-valuenow",
            String(percentage)
        );
        slider.setAttribute(
            "aria-valuetext",
            `${percentage}%`
        );
    }

    if (valueLabel) {
        valueLabel.textContent =
            `${percentage}%`;
    }

}

function applySFXVolume() {

    const masterVolume =
        getSoundVolume();

    const scale =
        masterVolume / SFX_REFERENCE_VOLUME;

    const baseVolumes = {
        buttonClick: 0.42,
        hoverGame: 0.48,
        talking: 0.28
    };

    Object.keys(baseVolumes).forEach(
        type => {

            const sound =
                soundEffects[type];

            if (!sound) {
                return;
            }

            sound.volume =
                clampAudioVolume(
                    baseVolumes[type] * scale
                );

        }
    );

    updateSoundVolumeUI();

}

function isSoundEnabled() {

    return localStorage.getItem(
        SOUND_ENABLED_KEY
    ) !== "false";

}

function playAppSFX(
    type,
    volume = 0.5
) {

    if (!isSoundEnabled()) {
        return;
    }

    const sound =
        soundEffects[type];

    if (!sound) {
        return;
    }

    try {

        sound.volume =
            clampAudioVolume(
                volume *
                (getSoundVolume() / SFX_REFERENCE_VOLUME)
            );

        sound.currentTime = 0;

        const playPromise =
            sound.play();

        if (
            playPromise &&
            typeof playPromise.catch === "function"
        ) {
            playPromise.catch(() => {});
        }

    } catch (error) {

        console.warn(
            "Unable to play sound effect:",
            error
        );

    }

}

function startTalkingSFX() {

    if (!isSoundEnabled()) {
        return;
    }

    const sound =
        soundEffects.talking;

    if (!sound) {
        return;
    }

    try {

        sound.volume =
            clampAudioVolume(
                0.28 *
                (getSoundVolume() / SFX_REFERENCE_VOLUME)
            );

        sound.currentTime = 0;

        const playPromise =
            sound.play();

        if (
            playPromise &&
            typeof playPromise.catch === "function"
        ) {
            playPromise.catch(() => {});
        }

    } catch (error) {

        console.warn(
            "Unable to play talking sound:",
            error
        );

    }

}

function stopTalkingSFX() {

    const sound =
        soundEffects.talking;

    if (!sound) {
        return;
    }

    sound.pause();
    sound.currentTime = 0;

}

window.playAppSFX =
    playAppSFX;

window.startTalkingSFX =
    startTalkingSFX;

window.stopTalkingSFX =
    stopTalkingSFX;

window.isAppSoundEnabled =
    isSoundEnabled;


applySFXVolume();


// Play the click effect for actual interactive controls.
document.addEventListener(
    "click",
    function (event) {

        const interactive =
            event.target.closest(
                "button, a, input[type='button'], input[type='submit'], input[type='reset'], [role='button']"
            );

        if (!interactive) {
            return;
        }

        playAppSFX(
            "buttonClick",
            0.42
        );

    },
    true
);


// Sound setting toggle and master volume.
const soundToggle =
    document.getElementById(
        "Sound-Toggle"
    );

const soundVolumeSlider =
    document.getElementById(
        "Sound-Volume"
    );

if (soundToggle) {

    const savedSound =
        localStorage.getItem(
            SOUND_ENABLED_KEY
        );

    soundToggle.checked =
        savedSound !== "false";

    soundToggle.addEventListener(
        "change",
        function () {

            localStorage.setItem(
                SOUND_ENABLED_KEY,
                soundToggle.checked
                    ? "true"
                    : "false"
            );

            if (!soundToggle.checked) {
                stopTalkingSFX();
            }

        }
    );

}

if (soundVolumeSlider) {

    soundVolumeSlider.value = String(
        Math.round(
            getSoundVolume() * 100
        )
    );

    soundVolumeSlider.addEventListener(
        "input",
        function () {

            const value =
                clampAudioVolume(
                    Number.parseInt(
                        soundVolumeSlider.value,
                        10
                    ) / 100
                );

            localStorage.setItem(
                SOUND_VOLUME_KEY,
                String(value)
            );

            applySFXVolume();

        }
    );

}

updateSoundVolumeUI();

window.addEventListener(
    "storage",
    function (event) {

        if (
            event.key ===
            SOUND_ENABLED_KEY
        ) {

            if (soundToggle) {
                soundToggle.checked =
                    event.newValue !== "false";
            }

            if (
                event.newValue ===
                "false"
            ) {
                stopTalkingSFX();
            }

            return;
        }

        if (
            event.key ===
            SOUND_VOLUME_KEY
        ) {
            applySFXVolume();
        }

    }
);


// ========================================
// HOME BUTTON
// ========================================

if (homeButton) {

    homeButton.addEventListener(
        "click",
        () => {

            window.location.href =
                "index.html";

        }
    );

}


// ========================================
// PLACES BUTTON
// ========================================

if (placesButton) {

    placesButton.addEventListener(
        "click",
        () => {

            window.location.href =
                "places.html";

        }
    );

}


// ========================================
// SETTINGS
// ========================================

if (
    settingsButton &&
    settingsOverlay
) {

    settingsButton.addEventListener(
        "click",
        () => {

            settingsOverlay.classList.remove(
                "hidden"
            );

        }
    );

}


// ========================================
// THEME PICKER
// ========================================

const themeCards =
    document.querySelectorAll(
        ".Theme-Card"
    );

const savedTheme =
    localStorage.getItem(
        "dateAppTheme"
    ) ||
    "default";


document.body.setAttribute(
    "data-theme",
    savedTheme
);


themeCards.forEach(
    card => {

        if (
            card.dataset.theme ===
            savedTheme
        ) {

            card.classList.add(
                "active"
            );

        }
        else {

            card.classList.remove(
                "active"
            );

        }

    }
);


themeCards.forEach(
    card => {

        card.addEventListener(
            "click",
            () => {

                const theme =
                    card.dataset.theme;


                document.body.setAttribute(
                    "data-theme",
                    theme
                );


                themeCards.forEach(
                    item => {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                card.classList.add(
                    "active"
                );


                localStorage.setItem(
                    "dateAppTheme",
                    theme
                );

            }
        );

    }
);


// ========================================
// CLOSE SETTINGS
// ========================================

if (
    closeSettings &&
    settingsOverlay
) {

    closeSettings.addEventListener(
        "click",
        () => {

            settingsOverlay.classList.add(
                "hidden"
            );

        }
    );

}


if (
    settingsDone &&
    settingsOverlay
) {

    settingsDone.addEventListener(
        "click",
        () => {

            settingsOverlay.classList.add(
                "hidden"
            );

        }
    );

}


if (settingsOverlay) {

    settingsOverlay.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                settingsOverlay
            ) {

                settingsOverlay.classList.add(
                    "hidden"
                );

            }

        }
    );

}


// ========================================
// DATE SCHEDULER ELEMENTS
// ========================================

const scheduleOverlay =
    document.getElementById(
        "Schedule-Overlay"
    );

const dateInput =
    document.getElementById(
        "Date-Input"
    );

const timeInput =
    document.getElementById(
        "Time-Input"
    );

const scheduleButton =
    document.getElementById(
        "Schedule-Button"
    );

const scheduleError =
    document.getElementById(
        "Schedule-Error"
    );


// ========================================
// PLANNER ELEMENTS
// ========================================

const plannerRoadmap =
    document.getElementById(
        "Planner-Roadmap"
    );

const plannerStepDate =
    document.getElementById(
        "Planner-Step-Date"
    );

const plannerStepPlace =
    document.getElementById(
        "Planner-Step-Place"
    );

const plannerStepSend =
    document.getElementById(
        "Planner-Step-Send"
    );

const plannerStepDone =
    document.getElementById(
        "Planner-Step-Done"
    );

const plannerSendButton =
    document.getElementById(
        "Planner-Send-Button"
    );


// ========================================
// SEND DATE ELEMENTS
// ========================================

const sendDateOverlay =
    document.getElementById(
        "Send-Date-Overlay"
    );

const closeSendDate =
    document.getElementById(
        "Close-Send-Date"
    );

const senderNameInput =
    document.getElementById(
        "Sender-Name"
    );

const receiverEmailInput =
    document.getElementById(
        "Receiver-Email"
    );

const sendDateButton =
    document.getElementById(
        "Send-Date-Button"
    );

const sendDateError =
    document.getElementById(
        "Send-Date-Error"
    );


// ========================================
// SEND SUMMARY
// ========================================

const summaryDate =
    document.getElementById(
        "Planner-Summary-Date"
    );

const summaryTime =
    document.getElementById(
        "Planner-Summary-Time"
    );

const summaryPlace =
    document.getElementById(
        "Planner-Summary-Place"
    );


// ========================================
// DONE OVERLAY ELEMENTS
// ========================================

const doneOverlay =
    document.getElementById(
        "Done-Overlay"
    );

const doneDate =
    document.getElementById(
        "Done-Date"
    );

const donePlace =
    document.getElementById(
        "Done-Place"
    );

const doneClose =
    document.getElementById(
        "Done-Close"
    );


// ========================================
// PLAN ANOTHER DATE ELEMENTS
// ========================================

const restartDateOverlay =
    document.getElementById(
        "Restart-Date-Overlay"
    );

const planAnotherYes =
    document.getElementById(
        "Plan-Another-Yes"
    );

const planAnotherNo =
    document.getElementById(
        "Plan-Another-No"
    );

const thankYouOverlay =
    document.getElementById(
        "Thank-You-Overlay"
    );

const thankYouClose =
    document.getElementById(
        "Thank-You-Close"
    );


// ========================================
// DATE PLAN STATE
// ========================================

const DATE_PLAN_KEY =
    "datePlannerState";


const defaultDatePlan = {

    date:
        null,

    time:
        null,

    formattedDate:
        null,

    formattedTime:
        null,

    place:
        null,

    dateComplete:
        false,

    placeComplete:
        false,

    sendComplete:
        false,

    senderName:
        "",

    receiverEmail:
        ""

};


// ========================================
// GET DATE PLAN
// ========================================

function getDatePlan() {

    try {

        const saved =
            JSON.parse(
                localStorage.getItem(
                    DATE_PLAN_KEY
                )
            );


        return {

            ...defaultDatePlan,

            ...(saved || {})

        };

    }
    catch (
        error
    ) {

        return {

            ...defaultDatePlan

        };

    }

}


// ========================================
// SAVE DATE PLAN
// ========================================

function saveDatePlan(
    plan
) {

    localStorage.setItem(
        DATE_PLAN_KEY,
        JSON.stringify(
            plan
        )
    );

}


let datePlan =
    getDatePlan();


// ========================================
// RESET DATE PLAN
// ========================================

function resetDatePlan() {

    const emptyPlan = {
        ...defaultDatePlan
    };


    localStorage.setItem(
        DATE_PLAN_KEY,
        JSON.stringify(
            emptyPlan
        )
    );


    datePlan =
        emptyPlan;


    updatePlanner();

}


// ========================================
// CHECK COMPLETED PLAN ON REFRESH
// ========================================

function handlePlannerRefresh() {

    const currentPlan =
        getDatePlan();


    const allTasksComplete =
        currentPlan.dateComplete &&
        currentPlan.placeComplete &&
        currentPlan.sendComplete;


    /*
     * Reset the planner when the page
     * is loaded again and every planner
     * task was already complete.
     */

    if (
        allTasksComplete
    ) {

        resetDatePlan();

    }

}


// ========================================
// HIDE PLANNER FOR HOVER GAME
// ========================================

function hidePlannerForGame() {

    if (!plannerRoadmap) {
        return;
    }


    plannerRoadmap.classList.add(
        "game-hidden"
    );

}


// ========================================
// SHOW PLANNER AFTER HOVER GAME
// ========================================

function showPlannerAfterGame() {

    if (!plannerRoadmap) {
        return;
    }


    plannerRoadmap.classList.remove(
        "game-hidden"
    );

}


// ========================================
// UPDATE ROADMAP
// ========================================

function updatePlanner() {

    datePlan =
        getDatePlan();


    // ====================================
    // DATE
    // ====================================

    if (
        datePlan.dateComplete
    ) {

        if (plannerStepDate) {

            plannerStepDate.classList.add(
                "completed"
            );

            plannerStepDate.classList.remove(
                "active",
                "locked"
            );


            const icon =
                plannerStepDate.querySelector(
                    ".Planner-Step-Icon"
                );


            if (icon) {

                icon.textContent =
                    "✓";

            }

        }

    }
    else {

        if (plannerStepDate) {

            plannerStepDate.classList.add(
                "active"
            );

            plannerStepDate.classList.remove(
                "completed",
                "locked"
            );


            const icon =
                plannerStepDate.querySelector(
                    ".Planner-Step-Icon"
                );


            if (icon) {

                icon.textContent =
                    "○";

            }

        }

    }


    // ====================================
    // PLACE
    // ====================================

    if (
        datePlan.placeComplete
    ) {

        if (plannerStepPlace) {

            plannerStepPlace.classList.add(
                "completed"
            );

            plannerStepPlace.classList.remove(
                "active",
                "locked"
            );


            const icon =
                plannerStepPlace.querySelector(
                    ".Planner-Step-Icon"
                );


            if (icon) {

                icon.textContent =
                    "✓";

            }

        }

    }
    else {

        if (plannerStepPlace) {

            if (
                datePlan.dateComplete
            ) {

                plannerStepPlace.classList.add(
                    "active"
                );

                plannerStepPlace.classList.remove(
                    "locked"
                );

            }
            else {

                plannerStepPlace.classList.add(
                    "locked"
                );

                plannerStepPlace.classList.remove(
                    "active"
                );

            }


            plannerStepPlace.classList.remove(
                "completed"
            );


            const icon =
                plannerStepPlace.querySelector(
                    ".Planner-Step-Icon"
                );


            if (icon) {

                icon.textContent =
                    datePlan.dateComplete
                        ? "○"
                        : "🔒";

            }

        }

    }


    // ====================================
    // SEND
    // ====================================

    const readyToSend =
        datePlan.dateComplete &&
        datePlan.placeComplete;


    if (
        datePlan.sendComplete
    ) {

        if (plannerStepSend) {

            plannerStepSend.classList.add(
                "completed"
            );

            plannerStepSend.classList.remove(
                "active",
                "locked"
            );


            const icon =
                plannerStepSend.querySelector(
                    ".Planner-Step-Icon"
                );


            if (icon) {

                icon.textContent =
                    "✓";

            }

        }


        if (plannerSendButton) {

            plannerSendButton.classList.add(
                "hidden"
            );

        }

    }
    else if (
        readyToSend
    ) {

        if (plannerStepSend) {

            plannerStepSend.classList.add(
                "active"
            );

            plannerStepSend.classList.remove(
                "locked",
                "completed"
            );


            const icon =
                plannerStepSend.querySelector(
                    ".Planner-Step-Icon"
                );


            if (icon) {

                icon.textContent =
                    "🔓";

            }

        }


        if (plannerSendButton) {

            plannerSendButton.classList.remove(
                "hidden"
            );

        }

    }
    else {

        if (plannerStepSend) {

            plannerStepSend.classList.add(
                "locked"
            );

            plannerStepSend.classList.remove(
                "active",
                "completed"
            );


            const icon =
                plannerStepSend.querySelector(
                    ".Planner-Step-Icon"
                );


            if (icon) {

                icon.textContent =
                    "🔒";

            }

        }


        if (plannerSendButton) {

            plannerSendButton.classList.add(
                "hidden"
            );

        }

    }


    // ====================================
    // DONE
    // ====================================

    if (
        datePlan.sendComplete
    ) {

        if (plannerStepDone) {

            plannerStepDone.classList.add(
                "completed"
            );

            plannerStepDone.classList.remove(
                "locked",
                "active"
            );


            const icon =
                plannerStepDone.querySelector(
                    ".Planner-Step-Icon"
                );


            if (icon) {

                icon.textContent =
                    "✓";

            }

        }

    }
    else {

        if (plannerStepDone) {

            plannerStepDone.classList.add(
                "locked"
            );

            plannerStepDone.classList.remove(
                "completed",
                "active"
            );


            const icon =
                plannerStepDone.querySelector(
                    ".Planner-Step-Icon"
                );


            if (icon) {

                icon.textContent =
                    "🔒";

            }

        }

    }

}


// ========================================
// AVATARS
// ========================================

function getConfiguredAvatar(
    key,
    fallback
) {

    return localStorage.getItem(
        `dateAppAvatar_${key}`
    ) || fallback;

}


let avatarNormal =
    getConfiguredAvatar(
        "normal",
        "character/asking_avatar.png"
    );

let avatarSad =
    getConfiguredAvatar(
        "sad",
        "character/sad_avatar.png"
    );

let avatarHappy =
    getConfiguredAvatar(
        "happy",
        "character/happy_avatar.png"
    );

let avatarExcited =
    getConfiguredAvatar(
        "excited",
        "character/excited_avatar.png"
    );

let avatarPlead =
    getConfiguredAvatar(
        "plead",
        "character/plead_avatar.png"
    );

let avatarDesperate =
    getConfiguredAvatar(
        "desperate",
        "character/desperate_avatar.png"
    );

let avatarAngry =
    getConfiguredAvatar(
        "angry",
        "character/angry_avatar.png"
    );

let avatarYey =
    getConfiguredAvatar(
        "yey",
        "character/yey_avatar.png"
    );


// ========================================
// AVATAR FUNCTION
// ========================================

function changeAvatar(
    image
) {

    if (avatar) {

        avatar.src =
            image;

    }

}


// ========================================
// GAME SETTINGS
// ========================================

const typingSpeed =
    45;

const countdownTime =
    3;

const gameDuration =
    30;


// ========================================
// GAME STATE
// ========================================

let gameState =
    "waiting";

let noClicks =
    0;

let hoverCount =
    0;

let score =
    0;

let typingID =
    0;

let countdownInterval =
    null;

let gameTimer =
    null;

let gameEndTime =
    null;

let yesEndingActive =
    false;


// ========================================
// NO DIALOGUE
// ========================================

const responses = [

    "Are you sure (T^T)???",

    "LUHHHHHHHHHH",

    "Sure kanaaaaaaaaaa???",

    "Bakit? HUHUHUHUHU",

    "Sige naaaaaaaaaaa!!!",

    "Libre kita matchaaaaaaaaaa",

    "Pleaseeeeeeeeeeeeeeeee",

    "You can't keep saying no!!!!!!!!"

];


// ========================================
// NO AVATARS
// ========================================

let noAvatars = [

    avatarSad,

    avatarSad,

    avatarPlead,

    avatarPlead,

    avatarDesperate,

    avatarDesperate,

    avatarAngry,

    avatarAngry

];


// ========================================
// CHANGE DIALOGUE
// ========================================

function changeDialogue(
    text
) {

    if (
        !dialog ||
        !avatar
    ) {

        return;

    }


    typingID++;


    const currentTypingID =
        typingID;


    dialog.textContent =
        "";


    avatar.classList.add(
        "talking"
    );

    startTalkingSFX();


    dialog.classList.remove(
        "change"
    );


    let characterIndex =
        0;


    function typeCharacter() {

        if (
            currentTypingID !==
            typingID
        ) {

            avatar.classList.remove(
                "talking"
            );

            stopTalkingSFX();

            return;

        }


        if (
            characterIndex <
            text.length
        ) {

            dialog.textContent +=
                text.charAt(
                    characterIndex
                );


            characterIndex++;


            setTimeout(
                typeCharacter,
                typingSpeed
            );

        }
        else {

            avatar.classList.remove(
                "talking"
            );

            stopTalkingSFX();

        }

    }


    typeCharacter();

}


// ========================================
// NO BUTTON CLICK
// ========================================

if (noButton) {

    noButton.addEventListener(
        "click",
        () => {

            if (
                gameState !==
                "waiting"
            ) {

                return;

            }


            if (
                noClicks >=
                responses.length
            ) {

                return;

            }


            changeAvatar(
                noAvatars[noClicks]
            );


            changeDialogue(
                responses[noClicks]
            );


            const scale =
                Math.max(
                    0.375,
                    1 -
                    (
                        (
                            noClicks +
                            1
                        ) *
                        0.06
                    )
                );


            noButton.style.transform =
                `scale(${scale})`;


            noClicks++;


            if (
                noClicks ===
                responses.length
            ) {

                gameState =
                    "ready";


                noButton.classList.add(
                    "game-ready"
                );


                setTimeout(
                    () => {

                        if (
                            gameState ===
                            "ready"
                        ) {

                            changeDialogue(
                                "Wait... you still want to say no?"
                            );

                        }

                    },
                    1200
                );

            }

        }
    );

}


// ========================================
// NO BUTTON HOVER
// ========================================

if (noButton) {

    noButton.addEventListener(
        "mouseenter",
        () => {

            if (
                gameState ===
                "playing"
            ) {

                playAppSFX(
                    "hoverGame",
                    0.48
                );

                addScore();

                changeAvatar(
                    avatarExcited
                );

                moveNoButton();

                return;

            }


            if (
                gameState ===
                "waiting" &&
                !noButton.classList.contains(
                    "game-ready"
                )
            ) {

                changeAvatar(
                    avatarSad
                );

                return;

            }


            if (
                gameState ===
                "ready"
            ) {

                hoverCount++;


                if (
                    hoverCount ===
                    1
                ) {

                    changeAvatar(
                        avatarSad
                    );

                    changeDialogue(
                        "Huh? You want to say no again?"
                    );

                }

                else if (
                    hoverCount ===
                    2
                ) {

                    changeAvatar(
                        avatarSad
                    );

                    changeDialogue(
                        "Ayaw talaga ehhhhhhh..."
                    );

                }

                else if (
                    hoverCount ===
                    3
                ) {

                    changeAvatar(
                        avatarExcited
                    );

                    changeDialogue(
                        "Sige nga, taasan mo nga score mo!!!"
                    );

                    startCountdown();

                }

            }

        }
    );

}


// ========================================
// YES BUTTON HOVER
// ========================================

if (yesButton) {

    yesButton.addEventListener(
        "mouseenter",
        () => {

            if (
                gameState !==
                "waiting"
            ) {

                return;

            }


            changeAvatar(
                avatarHappy
            );

        }
    );

}


// ========================================
// START COUNTDOWN
// ========================================

function startCountdown() {

    if (
        gameState !==
        "ready"
    ) {

        return;

    }


    gameState =
        "countdown";


    // ====================================
    // HIDE ROADMAP
    // ====================================

    hidePlannerForGame();


    if (noButton) {

        noButton.style.pointerEvents =
            "none";

    }


    if (yesButton) {

        yesButton.style.pointerEvents =
            "none";

    }


    if (gamePage) {

        gamePage.classList.add(
            "blurred"
        );

    }


    changeAvatar(
        avatarExcited
    );


    if (countdownOverlay) {

        countdownOverlay.classList.remove(
            "hidden"
        );

    }


    let count =
        countdownTime;


    if (countdownText) {

        countdownText.textContent =
            count;

    }


    restartCountdownAnimation();


    countdownInterval =
        setInterval(
            () => {

                count--;


                if (
                    count > 0
                ) {

                    if (countdownText) {

                        countdownText.textContent =
                            count;

                    }

                    restartCountdownAnimation();

                }
                else {

                    if (countdownText) {

                        countdownText.textContent =
                            "GO!";

                    }

                    restartCountdownAnimation();


                    clearInterval(
                        countdownInterval
                    );


                    countdownInterval =
                        null;


                    setTimeout(
                        () => {

                            if (countdownOverlay) {

                                countdownOverlay.classList.add(
                                    "hidden"
                                );

                            }


                            startGame();

                        },
                        600
                    );

                }

            },
            1000
        );

}


// ========================================
// RESTART COUNTDOWN
// ========================================

function restartCountdownAnimation() {

    if (!countdownText) {

        return;

    }


    countdownText.style.animation =
        "none";


    void countdownText.offsetWidth;


    countdownText.style.animation =
        "countdownPop 1s ease";

}


// ========================================
// START GAME
// ========================================

function startGame() {

    gameState =
        "playing";


    if (gamePage) {

        gamePage.classList.remove(
            "blurred"
        );

    }


    score =
        0;


    if (scoreText) {

        scoreText.textContent =
            score;

    }


    if (scoreDisplay) {

        scoreDisplay.style.display =
            "block";

    }


    if (noButton) {

        noButton.style.pointerEvents =
            "auto";

    }


    if (yesButton) {

        yesButton.style.pointerEvents =
            "none";

    }


    changeAvatar(
        avatarExcited
    );


    moveNoButton();


    gameEndTime =
        Date.now() +
        (
            gameDuration *
            1000
        );


    gameTimer =
        setInterval(
            () => {

                const remaining =
                    gameEndTime -
                    Date.now();


                if (
                    remaining <=
                    0
                ) {

                    clearInterval(
                        gameTimer
                    );


                    gameTimer =
                        null;


                    endGame();

                }

            },
            100
        );

}


// ========================================
// SCORE
// ========================================

function addScore() {

    score++;


    if (scoreText) {

        scoreText.textContent =
            score;

    }


    if (scoreDisplay) {

        scoreDisplay.classList.remove(
            "score-pop"
        );


        void scoreDisplay.offsetWidth;


        scoreDisplay.classList.add(
            "score-pop"
        );

    }

}


// ========================================
// MOVE NO BUTTON
// ========================================

function moveNoButton() {

    if (!noButton) {

        return;

    }


    const buttonWidth =
        noButton.offsetWidth;

    const buttonHeight =
        noButton.offsetHeight;

    const padding =
        20;


    const maxX =
        window.innerWidth -
        buttonWidth -
        padding;


    const maxY =
        window.innerHeight -
        buttonHeight -
        padding;


    const minY =
        80;


    const randomX =
        Math.random() *
        Math.max(
            0,
            maxX - padding
        ) +
        padding;


    const randomY =
        Math.random() *
        Math.max(
            0,
            maxY - minY
        ) +
        minY;


    noButton.style.position =
        "fixed";


    noButton.style.left =
        `${randomX}px`;


    noButton.style.top =
        `${randomY}px`;


    const currentScale =
        Math.max(
            0.375,
            1 -
            (
                noClicks *
                0.06
            )
        );


    noButton.style.transform =
        `scale(${currentScale})`;

}


// ========================================
// END GAME
// ========================================

function endGame() {

    if (
        gameState !==
        "playing"
    ) {

        return;

    }


    gameState =
        "finished";


    if (gameTimer) {

        clearInterval(
            gameTimer
        );


        gameTimer =
            null;

    }


    if (noButton) {

        noButton.style.pointerEvents =
            "none";

    }


    if (yesButton) {

        yesButton.style.pointerEvents =
            "none";

    }


    if (scoreDisplay) {

        scoreDisplay.style.display =
            "none";

    }


    if (finalScoreText) {

        finalScoreText.textContent =
            score;

    }


    changeAvatar(
        avatarExcited
    );


    if (finishMessage) {

        if (
            score >= 30
        ) {

            finishMessage.textContent =
                `WOAAAHHH?! lakas ahhh naka ${score}`;

        }
        else if (
            score >= 20
        ) {

            finishMessage.textContent =
                `Wowowow galing naka ${score}`;

        }
        else if (
            score >= 10
        ) {

            finishMessage.textContent =
                `Niceeeee ${score}, pwede na`;

        }
        else if (
            score > 0
        ) {

            finishMessage.textContent =
                `Galingan mo naman naka ${score} ka laaaaaaaaaaaang?`;

        }
        else {

            finishMessage.textContent =
                "ngiiiiii 0?!";

        }

    }


    if (gamePage) {

        gamePage.classList.add(
            "blurred"
        );

    }


    if (finishOverlay) {

        finishOverlay.classList.remove(
            "hidden"
        );

    }


    setTimeout(
        () => {

            if (finishOverlay) {

                finishOverlay.classList.add(
                    "hidden"
                );

            }


            if (gamePage) {

                gamePage.classList.remove(
                    "blurred"
                );

            }


            // ====================================
            // SHOW ROADMAP AGAIN
            // ====================================

            showPlannerAfterGame();


            resetGame();

        },
        3500
    );

}


// ========================================
// RESET GAME
// ========================================

function resetGame() {

    // Always restore the roadmap
    showPlannerAfterGame();


    gameState =
        "waiting";


    noClicks =
        0;


    hoverCount =
        0;


    score =
        0;


    typingID++;


    if (scoreText) {

        scoreText.textContent =
            "0";

    }


    if (scoreDisplay) {

        scoreDisplay.style.display =
            "none";

    }


    if (noButton) {

        noButton.classList.remove(
            "game-ready"
        );


        noButton.style.position =
            "relative";


        noButton.style.left =
            "";


        noButton.style.top =
            "";


        noButton.style.pointerEvents =
            "auto";


        noButton.style.transform =
            "scale(1)";

    }


    if (yesButton) {

        yesButton.style.display =
            "";


        yesButton.style.pointerEvents =
            "auto";

    }


    changeAvatar(
        avatarNormal
    );


    if (avatar) {

        avatar.classList.remove(
            "talking"
        );

    }

    stopTalkingSFX();


    changeDialogue(
        "Do you wanna go on a date with me?"
    );

}


// ========================================
// YES BUTTON
// ========================================

if (yesButton) {

    yesButton.addEventListener(
        "click",
        async () => {

            if (
                gameState !==
                "waiting"
            ) {

                return;

            }


            if (
                yesEndingActive
            ) {

                return;

            }


            yesEndingActive =
                true;


            gameState =
                "accepted";


            changeAvatar(
                avatarYey
            );


            if (noButton) {

                noButton.classList.remove(
                    "game-ready"
                );


                noButton.style.pointerEvents =
                    "none";


                noButton.style.display =
                    "none";

            }


            yesButton.style.pointerEvents =
                "none";


            yesButton.style.display =
                "none";


            await typeDialogueAndWait(
                "YAY!!! You said yes!!!!!!!!!"
            );


            await wait(
                900
            );


            await typeDialogueAndWait(
                "Well wala ka namang choice, jk hahahahha"
            );


            await wait(
                900
            );


            await typeDialogueAndWait(
                "Pili ka schedule kung kelan ka available!"
            );


            await wait(
                900
            );


            await typeDialogueAndWait(
                "I can't wait to see you, I Love You So Muuuuuuuuuuuch!!!!!!!"
            );


            await wait(
                1500
            );


            openSchedule();

        }
    );

}


// ========================================
// TYPE DIALOGUE AND WAIT
// ========================================

function typeDialogueAndWait(
    text
) {

    return new Promise(
        resolve => {

            if (
                !dialog ||
                !avatar
            ) {

                resolve();

                return;

            }


            typingID++;


            const currentTypingID =
                typingID;


            dialog.textContent =
                "";


            avatar.classList.add(
                "talking"
            );

            startTalkingSFX();


            dialog.classList.remove(
                "change"
            );


            let characterIndex =
                0;


            function typeCharacter() {

                if (
                    currentTypingID !==
                    typingID
                ) {

                    avatar.classList.remove(
                        "talking"
                    );

                    stopTalkingSFX();

                    resolve();

                    return;

                }


                if (
                    characterIndex <
                    text.length
                ) {

                    dialog.textContent +=
                        text.charAt(
                            characterIndex
                        );


                    characterIndex++;


                    setTimeout(
                        typeCharacter,
                        typingSpeed
                    );

                }
                else {

                    avatar.classList.remove(
                        "talking"
                    );

                    stopTalkingSFX();


                    resolve();

                }

            }


            typeCharacter();

        }
    );

}


// ========================================
// DATE SCHEDULER
// ========================================

function openSchedule() {

    gameState =
        "date";


    if (gamePage) {

        gamePage.classList.add(
            "blurred"
        );

    }


    if (scheduleOverlay) {

        scheduleOverlay.classList.remove(
            "hidden"
        );

    }


    if (scheduleError) {

        scheduleError.classList.add(
            "hidden"
        );

    }


    // ====================================
    // TODAY AS MINIMUM
    // ====================================

    if (dateInput) {

        const today =
            new Date();


        const year =
            today.getFullYear();


        const month =
            String(
                today.getMonth() + 1
            ).padStart(
                2,
                "0"
            );


        const day =
            String(
                today.getDate()
            ).padStart(
                2,
                "0"
            );


        dateInput.min =
            `${year}-${month}-${day}`;

    }

}


// ========================================
// CONFIRM DATE
// ========================================

if (scheduleButton) {

    scheduleButton.addEventListener(
        "click",
        async () => {

            if (
                !dateInput ||
                !timeInput ||
                !dateInput.value ||
                !timeInput.value
            ) {

                if (scheduleError) {

                    scheduleError.classList.remove(
                        "hidden"
                    );

                }

                return;

            }


            if (scheduleError) {

                scheduleError.classList.add(
                    "hidden"
                );

            }


            // ====================================
            // FORMAT DATE
            // ====================================

            const [
                year,
                month,
                day
            ] =
                dateInput.value.split("-");


            const dateObject =
                new Date(
                    Number(year),
                    Number(month) - 1,
                    Number(day)
                );


            const formattedDate =
                dateObject.toLocaleDateString(
                    "en-US",
                    {
                        weekday:
                            "long",

                        year:
                            "numeric",

                        month:
                            "long",

                        day:
                            "numeric"
                    }
                );


            const [
                hourString,
                minuteString
            ] =
                timeInput.value.split(":");


            const tempDate =
                new Date(
                    2000,
                    0,
                    1,
                    Number(hourString),
                    Number(minuteString)
                );


            const formattedTime =
                tempDate.toLocaleTimeString(
                    "en-US",
                    {
                        hour:
                            "numeric",

                        minute:
                            "2-digit"
                    }
                );


            // ====================================
            // SAVE DATE PLAN
            // ====================================

            datePlan =
                getDatePlan();


            datePlan.date =
                dateInput.value;


            datePlan.time =
                timeInput.value;


            datePlan.formattedDate =
                formattedDate;


            datePlan.formattedTime =
                formattedTime;


            datePlan.dateComplete =
                true;


            saveDatePlan(
                datePlan
            );


            updatePlanner();


            // ====================================
            // CLOSE SCHEDULER
            // ====================================

            if (scheduleOverlay) {

                scheduleOverlay.classList.add(
                    "hidden"
                );

            }


            if (gamePage) {

                gamePage.classList.remove(
                    "blurred"
                );

            }


            // ====================================
            // CONFIRMATION DIALOGUE
            // ====================================

            await typeDialogueAndWait(
                "DATE CONFIRMED!!! 💕"
            );


            await wait(
                1000
            );


            await typeDialogueAndWait(
                `${formattedDate} at ${formattedTime} ❤️`
            );


            await wait(
                1400
            );


            await typeDialogueAndWait(
                "Now pick a place for our date! 📍💕"
            );


            await wait(
                1700
            );


            // ====================================
            // GO TO PLACES
            // ====================================

            window.location.href =
                "places.html";

        }
    );

}


// ========================================
// OPEN SEND DATE
// ========================================

function openSendDate() {

    datePlan =
        getDatePlan();


    if (
        !datePlan.dateComplete ||
        !datePlan.placeComplete
    ) {

        return;

    }


    if (summaryDate) {

        summaryDate.textContent =
            datePlan.formattedDate ||
            datePlan.date;

    }


    if (summaryTime) {

        summaryTime.textContent =
            datePlan.formattedTime ||
            datePlan.time;

    }


    if (summaryPlace) {

        summaryPlace.textContent =
            datePlan.place ||
            "—";

    }


    if (senderNameInput) {

        senderNameInput.value =
            datePlan.senderName ||
            "";

    }


    if (receiverEmailInput) {

        receiverEmailInput.value =
            datePlan.receiverEmail ||
            "";

    }


    if (sendDateError) {

        sendDateError.textContent =
            "";

        sendDateError.classList.add(
            "hidden"
        );

    }


    if (sendDateOverlay) {

        sendDateOverlay.classList.remove(
            "hidden"
        );

    }

}


// ========================================
// SEND ROADMAP BUTTON
// ========================================

if (plannerSendButton) {

    plannerSendButton.addEventListener(
        "click",
        openSendDate
    );

}


if (plannerStepSend) {

    plannerStepSend.addEventListener(
        "click",
        () => {

            datePlan =
                getDatePlan();


            if (
                datePlan.dateComplete &&
                datePlan.placeComplete
            ) {

                openSendDate();

            }

        }
    );

}


// ========================================
// CLOSE SEND OVERLAY
// ========================================

if (closeSendDate) {

    closeSendDate.addEventListener(
        "click",
        () => {

            if (sendDateOverlay) {

                sendDateOverlay.classList.add(
                    "hidden"
                );

            }

        }
    );

}


if (sendDateOverlay) {

    sendDateOverlay.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                sendDateOverlay
            ) {

                sendDateOverlay.classList.add(
                    "hidden"
                );

            }

        }
    );

}


// ========================================
// SEND DATE
// ========================================

if (sendDateButton) {

    sendDateButton.addEventListener(
        "click",
        () => {

            const name =
                senderNameInput
                    ? senderNameInput.value.trim()
                    : "";


            const email =
                receiverEmailInput
                    ? receiverEmailInput.value.trim()
                    : "";


            // ====================================
            // VALIDATION
            // ====================================

            if (!name) {

                showSendError(
                    "Please enter your name."
                );

                return;

            }


            if (!isValidEmail(email)) {

                showSendError(
                    "Please enter a valid email address."
                );

                return;

            }


            datePlan =
                getDatePlan();


            if (
                !datePlan.dateComplete ||
                !datePlan.placeComplete
            ) {

                showSendError(
                    "Please complete the date and place steps first."
                );

                return;

            }


            // ====================================
            // SAVE SENDER INFORMATION
            // ====================================

            datePlan.senderName =
                name;


            datePlan.receiverEmail =
                email;


            // ====================================
            // COMPLETE SEND STEP
            // ====================================

            datePlan.sendComplete =
                true;


            saveDatePlan(
                datePlan
            );


            updatePlanner();


            // ====================================
            // EMAIL CONTENT
            // ====================================

            const subject =
                encodeURIComponent(
                    "💕 Our Date Plan"
                );


            const body =
                encodeURIComponent(
                    `Hi!\n\n` +
                    `${name} planned a date with you! ❤️\n\n` +
                    `📅 Date: ${datePlan.formattedDate}\n` +
                    `⏰ Time: ${datePlan.formattedTime}\n` +
                    `📍 Place: ${datePlan.place}\n\n` +
                    `It's a date!!! 🥰💕`
                );


            const mailtoURL =
                `mailto:${email}?subject=${subject}&body=${body}`;


            // ====================================
            // OPEN EMAIL WITHOUT LEAVING PAGE
            // ====================================

            const mailLink =
                document.createElement(
                    "a"
                );


            mailLink.href =
                mailtoURL;


            mailLink.target =
                "_blank";


            mailLink.rel =
                "noopener noreferrer";


            document.body.appendChild(
                mailLink
            );


            mailLink.click();


            document.body.removeChild(
                mailLink
            );


            // ====================================
            // CLOSE SEND OVERLAY
            // ====================================

            if (sendDateOverlay) {

                sendDateOverlay.classList.add(
                    "hidden"
                );

            }


            // ====================================
            // SHOW DONE
            // ====================================

            showDoneOverlay();

        }
    );

}


// ========================================
// SEND ERROR
// ========================================

function showSendError(
    message
) {

    if (!sendDateError) {

        return;

    }


    sendDateError.textContent =
        message;


    sendDateError.classList.remove(
        "hidden"
    );

}


// ========================================
// EMAIL VALIDATION
// ========================================

function isValidEmail(
    email
) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(
            email
        );

}


// ========================================
// DONE OVERLAY
// ========================================

function showDoneOverlay() {

    datePlan =
        getDatePlan();


    if (doneDate) {

        doneDate.textContent =
            `📅 ${datePlan.formattedDate} • ${datePlan.formattedTime}`;

    }


    if (donePlace) {

        donePlace.textContent =
            `📍 ${datePlan.place}`;

    }


    if (doneOverlay) {

        doneOverlay.classList.remove(
            "hidden"
        );

    }

}


// ========================================
// DONE CLOSE BUTTON
// ========================================

if (doneClose) {

    doneClose.addEventListener(
        "click",
        () => {

            if (doneOverlay) {

                doneOverlay.classList.add(
                    "hidden"
                );

            }


            showRestartDecision();

        }
    );

}


// ========================================
// SHOW PLAN ANOTHER DATE
// ========================================

function showRestartDecision() {

    if (restartDateOverlay) {

        restartDateOverlay.classList.remove(
            "hidden"
        );

    }

}


// ========================================
// PLAN ANOTHER DATE - YES
// ========================================

if (planAnotherYes) {

    planAnotherYes.addEventListener(
        "click",
        () => {

            if (restartDateOverlay) {

                restartDateOverlay.classList.add(
                    "hidden"
                );

            }


            if (doneOverlay) {

                doneOverlay.classList.add(
                    "hidden"
                );

            }


            if (thankYouOverlay) {

                thankYouOverlay.classList.add(
                    "hidden"
                );

            }


            if (scheduleOverlay) {

                scheduleOverlay.classList.add(
                    "hidden"
                );

            }


            // Reset planner
            resetDatePlan();


            // Reset game
            resetAcceptedState();


            if (gamePage) {

                gamePage.classList.remove(
                    "blurred"
                );

            }


            changeAvatar(
                avatarNormal
            );


            changeDialogue(
                "Okayyyy! Let's plan another date! 💕"
            );

        }
    );

}


// ========================================
// PLAN ANOTHER DATE - NO
// ========================================

if (planAnotherNo) {

    planAnotherNo.addEventListener(
        "click",
        async () => {

            if (restartDateOverlay) {

                restartDateOverlay.classList.add(
                    "hidden"
                );

            }


            if (doneOverlay) {

                doneOverlay.classList.add(
                    "hidden"
                );

            }


            changeAvatar(
                avatarYey
            );


            await typeDialogueAndWait(
                "Thank you for scheduling a date with me! ❤️"
            );


            await wait(
                700
            );


            await typeDialogueAndWait(
                "I hope we have a wonderful time together. 🥰💕"
            );


            await wait(
                700
            );


            if (thankYouOverlay) {

                thankYouOverlay.classList.remove(
                    "hidden"
                );

            }

        }
    );

}


// ========================================
// CLOSE THANK YOU
// ========================================

if (thankYouClose) {

    thankYouClose.addEventListener(
        "click",
        () => {

            if (thankYouOverlay) {

                thankYouOverlay.classList.add(
                    "hidden"
                );

            }

        }
    );

}


// ========================================
// WAIT HELPER
// ========================================

function wait(
    milliseconds
) {

    return new Promise(
        resolve => {

            setTimeout(
                resolve,
                milliseconds
            );

        }
    );

}


// ========================================
// RESET ACCEPTED STATE
// ========================================

function resetAcceptedState() {

    gameState =
        "waiting";


    noClicks =
        0;


    hoverCount =
        0;


    score =
        0;


    typingID++;


    if (noButton) {

        noButton.style.display =
            "";


        noButton.style.pointerEvents =
            "auto";


        noButton.style.position =
            "relative";


        noButton.style.left =
            "";


        noButton.style.top =
            "";


        noButton.style.transform =
            "scale(1)";


        noButton.classList.remove(
            "game-ready"
        );

    }


    if (yesButton) {

        yesButton.style.display =
            "";


        yesButton.style.pointerEvents =
            "auto";

    }


    if (scoreText) {

        scoreText.textContent =
            "0";

    }


    if (scoreDisplay) {

        scoreDisplay.style.display =
            "none";

    }


    changeAvatar(
        avatarNormal
    );


    if (avatar) {

        avatar.classList.remove(
            "talking"
        );

    }


    changeDialogue(
        "Do you wanna go on a date with me?"
    );


    yesEndingActive =
        false;

}


// ========================================
// WINDOW RESIZE
// ========================================

window.addEventListener(
    "resize",
    () => {

        if (
            gameState ===
            "playing"
        ) {

            moveNoButton();

        }

    }
);


// ========================================
// INITIALIZE PLANNER
// ========================================

handlePlannerRefresh();

updatePlanner();

// ========================================
// MUSIC + ADMIN SYSTEM
// ========================================

(function setupDateAppSettings() {

    "use strict";


    const MUSIC_ENABLED_KEY =
        "dateAppMusicEnabled";

    const MUSIC_VOLUME_KEY =
        "dateAppMusicVolume";

    const DEFAULT_MUSIC_VOLUME =
        0.45;

    const MUSIC_CHOICE_KEY =
        "dateAppMusicChoice";

    const MUSIC_LIBRARY_KEY =
        "dateAppMusicLibrary";

    const MUSIC_MANIFEST_URL =
        "music/music.json";

    let folderMusicLibrary = [];

    const ADMIN_SESSION_KEY =
        "dateAppAdminSession";

    const PLACES_LIBRARY_KEY =
        "dateAppAdminPlaces";

    const LEGACY_PLACES_LIBRARY_KEY =
        "dateAppPlaces";


    const ADMIN_USERNAME =
        "admin";

    const ADMIN_PASSWORD =
        "dateadmin123";


    const DEFAULT_PLACES = [

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


    const AVATAR_FIELDS = [
        ["normal", "Normal Avatar", "character/asking_avatar.png"],
        ["happy", "Happy Avatar", "character/happy_avatar.png"],
        ["sad", "Sad Avatar", "character/sad_avatar.png"],
        ["excited", "Excited Avatar", "character/excited_avatar.png"],
        ["plead", "Plead Avatar", "character/plead_avatar.png"],
        ["desperate", "Desperate Avatar", "character/desperate_avatar.png"],
        ["angry", "Angry Avatar", "character/angry_avatar.png"],
        ["yey", "Yey Avatar", "character/yey_avatar.png"]
    ];


    function getStoredJSON(key, fallback) {

        try {

            const value =
                JSON.parse(
                    localStorage.getItem(key)
                );

            return value ?? fallback;

        }
        catch (error) {

            return fallback;

        }

    }


    function saveJSON(key, value) {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

    }


    function getMusicLibrary() {

        const library =
            getStoredJSON(
                MUSIC_LIBRARY_KEY,
                []
            );

        return Array.isArray(library)
            ? library
            : [];

    }


    function getAllMusicLibrary() {

        const combined = [];
        const seen = new Set();

        [...folderMusicLibrary, ...getMusicLibrary()].forEach(track => {

            if (!track || !track.id || !track.source || seen.has(track.id)) {
                return;
            }

            seen.add(track.id);
            combined.push(track);

        });

        return combined;

    }


    async function loadMusicFolderLibrary() {

        try {

            const response = await fetch(MUSIC_MANIFEST_URL, {
                cache: "no-store"
            });

            if (!response.ok) {
                throw new Error(`Music manifest returned ${response.status}`);
            }

            const manifest = await response.json();

            folderMusicLibrary = Array.isArray(manifest)
                ? manifest.filter(track =>
                    track &&
                    typeof track.id === "string" &&
                    typeof track.name === "string" &&
                    typeof track.source === "string"
                )
                : [];

        }
        catch (error) {

            console.warn(
                "Could not load music/music.json. The app will still use admin-added music.",
                error
            );

            folderMusicLibrary = [];

        }

    }


    function getPlacesLibrary() {

        const stored =
            getStoredJSON(
                PLACES_LIBRARY_KEY,
                null
            );

        if (Array.isArray(stored) && stored.length) {
            return stored;
        }

        /*
         * Migrate the older storage key so existing
         * custom places are not lost when the admin
         * storage key is upgraded.
         */
        const legacy =
            getStoredJSON(
                LEGACY_PLACES_LIBRARY_KEY,
                null
            );

        if (Array.isArray(legacy) && legacy.length) {
            saveJSON(PLACES_LIBRARY_KEY, legacy);
            return legacy;
        }

        /*
         * First run: seed the editable default places into
         * the same storage used by the Admin panel.
         * From this point onward the Admin controls the
         * actual place collection.
         */
        const seededPlaces = DEFAULT_PLACES.map((place, index) => ({
            ...place,
            id: place.id || `default-place-${index + 1}`
        }));

        saveJSON(PLACES_LIBRARY_KEY, seededPlaces);

        return seededPlaces;

    }


    function isAdmin() {

        return sessionStorage.getItem(
            ADMIN_SESSION_KEY
        ) === "true";

    }


    function escapeHTML(value) {

        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");

    }


    // ====================================
    // MUSIC PLAYER
    // ====================================

    const musicToggle =
        document.getElementById(
            "Music-Toggle"
        );

    const musicChooser =
        document.getElementById(
            "Music-Chooser"
        );

    const musicVolumeSlider =
        document.getElementById(
            "Music-Volume"
        );

    const musicVolumeValue =
        document.getElementById(
            "Music-Volume-Value"
        );


    let backgroundMusic =
        document.getElementById(
            "Background-Music"
        );


    if (!backgroundMusic) {

        backgroundMusic =
            document.createElement(
                "audio"
            );

        backgroundMusic.id =
            "Background-Music";

        backgroundMusic.loop =
            true;

        backgroundMusic.preload =
            "metadata";

        backgroundMusic.style.display =
            "none";

        document.body.appendChild(
            backgroundMusic
        );

    }


    applyMusicVolume();


    function getMusicVolume() {

        const saved =
            Number.parseFloat(
                localStorage.getItem(
                    MUSIC_VOLUME_KEY
                )
            );

        if (!Number.isFinite(saved)) {
            return DEFAULT_MUSIC_VOLUME;
        }

        return Math.max(
            0,
            Math.min(
                1,
                saved
            )
        );

    }


    function updateMusicVolumeUI() {

        const percentage =
            Math.round(
                getMusicVolume() * 100
            );

        if (musicVolumeSlider) {

            musicVolumeSlider.value =
                String(percentage);

            musicVolumeSlider.setAttribute(
                "aria-valuenow",
                String(percentage)
            );

            musicVolumeSlider.setAttribute(
                "aria-valuetext",
                `${percentage}%`
            );

        }

        if (musicVolumeValue) {
            musicVolumeValue.textContent =
                `${percentage}%`;
        }

    }


    function applyMusicVolume() {

        if (backgroundMusic) {
            backgroundMusic.volume =
                getMusicVolume();
        }

        updateMusicVolumeUI();

    }


    function musicEnabled() {

        return localStorage.getItem(
            MUSIC_ENABLED_KEY
        ) !== "false";

    }


    function getSelectedMusic() {

        const library =
            getAllMusicLibrary();

        const selectedId =
            localStorage.getItem(
                MUSIC_CHOICE_KEY
            );

        if (
            !selectedId ||
            !library.length
        ) {

            return null;

        }

        return library.find(
            track => track.id === selectedId
        ) || null;

    }


    function populateMusicChooser() {

        if (!musicChooser) {
            return;
        }


        const library =
            getAllMusicLibrary();

        const selectedId =
            localStorage.getItem(
                MUSIC_CHOICE_KEY
            );


        musicChooser.innerHTML =
            "<option value=''>No music selected</option>";


        library.forEach(
            track => {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    track.id;

                option.textContent =
                    track.name;

                musicChooser.appendChild(
                    option
                );

            }
        );


        if (selectedId) {

            musicChooser.value =
                selectedId;

        }

    }


    function loadSelectedMusic(
        shouldPlay = false
    ) {

        const track =
            getSelectedMusic();


        if (!track) {

            backgroundMusic.pause();
            backgroundMusic.removeAttribute(
                "src"
            );
            backgroundMusic.load();
            return;

        }


        if (
            backgroundMusic.src !==
            new URL(
                track.source,
                window.location.href
            ).href
        ) {

            backgroundMusic.src =
                track.source;

        }

        applyMusicVolume();


        if (
            shouldPlay &&
            musicEnabled()
        ) {

            backgroundMusic.play()
                .catch(() => {});

        }

    }


    function initializeMusic() {

        const savedEnabled =
            localStorage.getItem(
                MUSIC_ENABLED_KEY
            );


        if (musicToggle) {

            musicToggle.checked =
                savedEnabled !== "false";


            musicToggle.addEventListener(
                "change",
                () => {

                    localStorage.setItem(
                        MUSIC_ENABLED_KEY,
                        musicToggle.checked
                            ? "true"
                            : "false"
                    );


                    if (
                        musicToggle.checked
                    ) {

                        loadSelectedMusic(
                            true
                        );

                    }
                    else {

                        backgroundMusic.pause();

                    }

                }
            );

        }


        populateMusicChooser();

        // Try to resume the previously selected song immediately on page load.
        // Browsers may block this until the user interacts with the page.
        loadSelectedMusic(true);

        loadMusicFolderLibrary().then(() => {

            populateMusicChooser();

            // The manifest may finish loading after the initial attempt.
            // Try again so a saved song can resume without opening Settings.
            loadSelectedMusic(true);

        });


        if (musicChooser) {

            musicChooser.addEventListener(
                "change",
                () => {

                    const id =
                        musicChooser.value;


                    localStorage.setItem(
                        MUSIC_CHOICE_KEY,
                        id
                    );


                    loadSelectedMusic(
                        true
                    );

                }
            );

        }


        if (musicVolumeSlider) {

            musicVolumeSlider.value =
                String(
                    Math.round(
                        getMusicVolume() * 100
                    )
                );

            musicVolumeSlider.addEventListener(
                "input",
                () => {

                    const value =
                        Math.max(
                            0,
                            Math.min(
                                1,
                                Number.parseInt(
                                    musicVolumeSlider.value,
                                    10
                                ) / 100
                            )
                        );

                    localStorage.setItem(
                        MUSIC_VOLUME_KEY,
                        String(value)
                    );

                    applyMusicVolume();

                }
            );

        }

        applyMusicVolume();


        window.addEventListener(
            "storage",
            event => {

                if (
                    event.key ===
                    MUSIC_VOLUME_KEY
                ) {
                    applyMusicVolume();
                }

            }
        );


        // Browsers may require a user gesture before audio can autoplay.
        // Listen for any normal interaction anywhere on the page, not just
        // the Settings panel, so opening/changing Settings is not required.
        let musicGestureHandled = false;

        const startMusicAfterGesture =
            () => {

                if (musicGestureHandled) {
                    return;
                }

                if (!musicEnabled()) {
                    return;
                }

                const track =
                    getSelectedMusic();

                if (!track) {
                    return;
                }

                backgroundMusic
                    .play()
                    .then(() => {
                        musicGestureHandled = true;
                    })
                    .catch(() => {
                        // Keep listening in case this interaction was not
                        // accepted as a user gesture by the browser.
                    });

            };


        [
            "pointerdown",
            "touchstart",
            "keydown",
            "click"
        ].forEach(eventName => {

            document.addEventListener(
                eventName,
                startMusicAfterGesture,
                { passive: true }
            );

        });


        // pageshow is useful when the browser restores this page from the
        // back/forward cache.
        window.addEventListener(
            "pageshow",
            () => {
                if (musicEnabled()) {
                    loadSelectedMusic(true);
                }
            }
        );

    }


    // ====================================
    // ADMIN PANEL HTML
    // ====================================

    function createAdminUI() {

        if (
            document.getElementById(
                "Admin-Login-Overlay"
            )
        ) {

            return;

        }


        const wrapper =
            document.createElement(
                "div"
            );


        wrapper.innerHTML = `

            <div
                id="Admin-Login-Overlay"
                class="Admin-Overlay hidden"
            >

                <div class="Admin-Login-Box">

                    <button
                        type="button"
                        id="Admin-Login-Close"
                        class="Admin-Close"
                    >
                        ×
                    </button>

                    <div class="Admin-Icon">🔐</div>

                    <h2>Admin Login</h2>

                    <p>
                        Sign in to manage our date app.
                    </p>

                    <input
                        type="text"
                        id="Admin-Username"
                        placeholder="Username"
                        autocomplete="username"
                    >

                    <input
                        type="password"
                        id="Admin-Password"
                        placeholder="Password"
                        autocomplete="current-password"
                    >

                    <button
                        type="button"
                        id="Admin-Login-Submit"
                        class="Admin-Primary-Button"
                    >
                        Login ❤️
                    </button>

                    <p
                        id="Admin-Login-Error"
                        class="Admin-Error hidden"
                    ></p>

                </div>

            </div>


            <div
                id="Admin-Panel-Overlay"
                class="Admin-Overlay hidden"
            >

                <div class="Admin-Panel-Box">

                    <div class="Admin-Panel-Header">

                        <div>
                            <div class="Admin-Icon">⚙️</div>
                            <h2>Admin Panel</h2>
                            <p>Manage places, music, and avatars.</p>
                        </div>

                        <div class="Admin-Panel-Header-Actions">

                            <button
                                type="button"
                                id="Admin-Save-Changes"
                                class="Admin-Primary-Button Admin-Save-Changes-Button"
                            >
                                💾 Save Changes
                            </button>

                            <button
                                type="button"
                                id="Admin-Logout"
                                class="Admin-Secondary-Button"
                            >
                                Logout
                            </button>

                            <button
                                type="button"
                                id="Admin-Panel-Close"
                                class="Admin-Close"
                            >
                                ×
                            </button>

                        </div>

                    </div>

                    <p
                        id="Admin-Save-Status"
                        class="Admin-Save-Status hidden"
                        aria-live="polite"
                    ></p>


                    <section class="Admin-Panel-Section">

                        <div class="Admin-Section-Heading">
                            <div>
                                <h3>📍 Places</h3>
                                <p>Add, edit, or remove place cards.</p>
                            </div>

                            <div class="Admin-Section-Heading-Actions">

                                <button
                                    type="button"
                                    id="Admin-Reset-Places"
                                    class="Admin-Secondary-Button Admin-Small-Button"
                                >
                                    ↺ Reset Defaults
                                </button>

                                <button
                                    type="button"
                                    id="Admin-New-Place"
                                    class="Admin-Primary-Button Admin-Small-Button"
                                >
                                    + Add Place
                                </button>

                            </div>
                        </div>

                        <div
                            id="Admin-Places-List"
                            class="Admin-Places-List"
                        ></div>

                        <form
                            id="Admin-Place-Form"
                            class="Admin-Editor-Form hidden"
                        >

                            <input
                                type="hidden"
                                id="Admin-Place-Index"
                                value=""
                            >

                            <h4 id="Admin-Place-Form-Title">
                                Add Place
                            </h4>

                            <div class="Admin-Form-Grid">

                                <label>
                                    Place Name
                                    <input
                                        id="Admin-Place-Name"
                                        type="text"
                                        required
                                    >
                                </label>

                                <label>
                                    Image
                                    <input
                                        id="Admin-Place-Image"
                                        type="file"
                                        accept="image/*"
                                    >
                                    <small>Leave empty to keep the current image.</small>
                                </label>

                            </div>

                            <label>
                                Short Description
                                <textarea
                                    id="Admin-Place-Short"
                                    rows="2"
                                    required
                                ></textarea>
                            </label>

                            <label>
                                Full Description
                                <textarea
                                    id="Admin-Place-Full"
                                    rows="4"
                                    required
                                ></textarea>
                            </label>

                            <div class="Admin-Form-Grid">

                                <label>
                                    Budget
                                    <input
                                        id="Admin-Place-Budget"
                                        type="text"
                                        placeholder="₱500 - ₱800"
                                    >
                                </label>

                                <label>
                                    What We Can Do
                                    <input
                                        id="Admin-Place-Activities"
                                        type="text"
                                        placeholder="Eat, talk, take pictures"
                                    >
                                </label>

                            </div>

                            <label>
                                Date Vibe
                                <input
                                    id="Admin-Place-Vibe"
                                    type="text"
                                    placeholder="Cozy & romantic"
                                >
                            </label>

                            <div class="Admin-Editor-Actions">

                                <button
                                    type="submit"
                                    class="Admin-Primary-Button"
                                >
                                    Save Place
                                </button>

                                <button
                                    type="button"
                                    id="Admin-Place-Cancel"
                                    class="Admin-Secondary-Button"
                                >
                                    Cancel
                                </button>

                            </div>

                            <p
                                id="Admin-Place-Message"
                                class="Admin-Message hidden"
                            ></p>

                        </form>

                    </section>


                    <section class="Admin-Panel-Section">

                        <div class="Admin-Section-Heading">
                            <div>
                                <h3>🎵 Music</h3>
                                <p>Add music tracks that appear in Settings.</p>
                            </div>
                        </div>

                        <form
                            id="Admin-Music-Form"
                            class="Admin-Editor-Form"
                        >

                            <label>
                                Music Name
                                <input
                                    id="Admin-Music-Name"
                                    type="text"
                                    placeholder="Our Song"
                                    required
                                >
                            </label>

                            <label>
                                Music File
                                <input
                                    id="Admin-Music-File"
                                    type="file"
                                    accept="audio/*"
                                >
                            </label>

                            <label>
                                Or Music URL / Path
                                <input
                                    id="Admin-Music-URL"
                                    type="url"
                                    placeholder="https://example.com/song.mp3"
                                >
                                <small>Use either an audio file or a direct audio URL.</small>
                            </label>

                            <button
                                type="submit"
                                class="Admin-Primary-Button"
                            >
                                Add Music
                            </button>

                            <p
                                id="Admin-Music-Message"
                                class="Admin-Message hidden"
                            ></p>

                        </form>

                        <div
                            id="Admin-Music-List"
                            class="Admin-Music-List"
                        ></div>

                    </section>


                    <section class="Admin-Panel-Section">

                        <div class="Admin-Section-Heading">
                            <div>
                                <h3>🖼️ Avatars</h3>
                                <p>Replace any avatar used by the date game.</p>
                            </div>
                        </div>

                        <div
                            id="Admin-Avatar-List"
                            class="Admin-Avatar-List"
                        ></div>

                    </section>

                </div>

            </div>

        `;


        document.body.appendChild(
            wrapper
        );

    }


    function showAdminLogin() {

        createAdminUI();

        const overlay =
            document.getElementById(
                "Admin-Login-Overlay"
            );


        const error =
            document.getElementById(
                "Admin-Login-Error"
            );


        if (error) {

            error.textContent =
                "";

            error.classList.add(
                "hidden"
            );

        }


        if (overlay) {

            overlay.classList.remove(
                "hidden"
            );

        }

    }


    function showAdminPanel() {

        createAdminUI();

        renderAdminPlaces();
        renderAdminMusic();
        renderAdminAvatars();


        const panel =
            document.getElementById(
                "Admin-Panel-Overlay"
            );


        if (panel) {

            panel.classList.remove(
                "hidden"
            );

        }

    }


    function hideAdminPanel() {

        const panel =
            document.getElementById(
                "Admin-Panel-Overlay"
            );


        if (panel) {

            panel.classList.add(
                "hidden"
            );

        }

    }


    function renderAdminPlaces() {

        const list =
            document.getElementById(
                "Admin-Places-List"
            );


        if (!list) {
            return;
        }


        const places =
            getPlacesLibrary();


        list.innerHTML =
            places.map(
                (place, index) => `
                    <div class="Admin-Place-Item">

                        <img
                            src="${escapeHTML(place.image)}"
                            alt="${escapeHTML(place.name)}"
                        >

                        <div class="Admin-Place-Item-Info">
                            <strong>${escapeHTML(place.name)}</strong>
                            <small>${escapeHTML(place.short)}</small>
                        </div>

                        <div class="Admin-Item-Actions">
                            <button
                                type="button"
                                class="Admin-Secondary-Button Admin-Edit-Place"
                                data-index="${index}"
                            >
                                Edit
                            </button>

                            <button
                                type="button"
                                class="Admin-Danger-Button Admin-Delete-Place"
                                data-index="${index}"
                            >
                                Delete
                            </button>
                        </div>

                    </div>
                `
            )
            .join("");

    }


    function renderAdminMusic() {

        const list =
            document.getElementById(
                "Admin-Music-List"
            );


        if (!list) {
            return;
        }


        const library =
            getMusicLibrary();


        if (!library.length) {

            list.innerHTML =
                `<div class="Admin-Empty-State">No music has been added yet.</div>`;

            return;

        }


        list.innerHTML =
            library.map(
                track => `
                    <div class="Admin-Music-Item">

                        <div>
                            <strong>${escapeHTML(track.name)}</strong>
                            <small>${track.source.startsWith("data:") ? "Uploaded audio" : escapeHTML(track.source)}</small>
                        </div>

                        <button
                            type="button"
                            class="Admin-Danger-Button Admin-Delete-Music"
                            data-id="${escapeHTML(track.id)}"
                        >
                            Remove
                        </button>

                    </div>
                `
            )
            .join("");

    }


    function renderAdminAvatars() {

        const list =
            document.getElementById(
                "Admin-Avatar-List"
            );


        if (!list) {
            return;
        }


        list.innerHTML =
            AVATAR_FIELDS.map(
                ([key, label, fallback]) => {

                    const current =
                        localStorage.getItem(
                            `dateAppAvatar_${key}`
                        ) || fallback;


                    return `
                        <div class="Admin-Avatar-Item">

                            <img
                                src="${escapeHTML(current)}"
                                alt="${escapeHTML(label)}"
                            >

                            <div>
                                <strong>${escapeHTML(label)}</strong>

                                <label class="Admin-File-Button">
                                    Change
                                    <input
                                        type="file"
                                        accept="image/*"
                                        class="Admin-Avatar-File"
                                        data-avatar-key="${escapeHTML(key)}"
                                    >
                                </label>

                                <button
                                    type="button"
                                    class="Admin-Secondary-Button Admin-Reset-Avatar"
                                    data-avatar-key="${escapeHTML(key)}"
                                >
                                    Reset
                                </button>

                            </div>

                        </div>
                    `;

                }
            )
            .join("");

    }


    function openPlaceEditor(index = -1) {

        const form =
            document.getElementById(
                "Admin-Place-Form"
            );


        if (!form) {
            return;
        }


        const places =
            getPlacesLibrary();

        const editing =
            index >= 0 &&
            places[index];


        document.getElementById(
            "Admin-Place-Form-Title"
        ).textContent =
            editing
                ? "Edit Place"
                : "Add Place";


        document.getElementById(
            "Admin-Place-Index"
        ).value =
            editing
                ? index
                : "";


        document.getElementById(
            "Admin-Place-Name"
        ).value =
            editing?.name || "";


        document.getElementById(
            "Admin-Place-Short"
        ).value =
            editing?.short || "";


        document.getElementById(
            "Admin-Place-Full"
        ).value =
            editing?.full || "";


        document.getElementById(
            "Admin-Place-Budget"
        ).value =
            editing?.budget || "";


        document.getElementById(
            "Admin-Place-Activities"
        ).value =
            editing?.activities || "";


        document.getElementById(
            "Admin-Place-Vibe"
        ).value =
            editing?.vibe || "";


        document.getElementById(
            "Admin-Place-Image"
        ).value =
            "";


        form.dataset.currentImage =
            editing?.image || "";


        form.classList.remove(
            "hidden"
        );


        form.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });

    }


    async function saveAdminChanges() {

        if (!isAdmin()) {
            return;
        }


        const status =
            document.getElementById(
                "Admin-Save-Status"
            );


        const placeForm =
            document.getElementById(
                "Admin-Place-Form"
            );


        /*
         * If the place editor is currently open,
         * validate and submit it so the values in
         * the form are actually committed before
         * the global Save Changes action finishes.
         */

        if (
            placeForm
            &&
            !placeForm.classList.contains("hidden")
        ) {

            if (!placeForm.reportValidity()) {

                showAdminMessage(
                    "Admin-Place-Message",
                    "Please complete the place form before saving changes.",
                    true
                );

                return;

            }


            /*
             * requestSubmit() runs the same submit
             * handler used by the Save Place button.
             */

            placeForm.requestSubmit();

            return;

        }


        /*
         * Re-save the currently stored collections.
         * This makes the global button an explicit
         * commit point even for settings that were
         * already persisted by their individual controls.
         */

        const currentPlaces =
            getPlacesLibrary();

        const currentMusic =
            getMusicLibrary();


        saveJSON(
            PLACES_LIBRARY_KEY,
            currentPlaces
        );


        saveJSON(
            MUSIC_LIBRARY_KEY,
            currentMusic
        );


        renderAdminPlaces();
        renderAdminMusic();
        renderAdminAvatars();
        populateMusicChooser();


        /*
         * Notify the active page immediately.
         * places.js listens for this event and
         * rebuilds the card deck from localStorage.
         */

        window.dispatchEvent(
            new CustomEvent(
                "dateAppPlacesUpdated"
            )
        );


        window.dispatchEvent(
            new CustomEvent(
                "dateAppMusicUpdated"
            )
        );


        window.dispatchEvent(
            new CustomEvent(
                "dateAppAvatarUpdated",
                {
                    detail: {
                        key: "all"
                    }
                }
            )
        );


        if (status) {

            status.textContent =
                "All admin changes have been saved successfully! ❤️";

            status.classList.remove(
                "hidden",
                "error"
            );

        }

    }


    function setupAdminEvents() {

        createAdminUI();


        const loginButton =
            document.getElementById(
                "Admin-Login-Button"
            );


        if (loginButton) {

            loginButton.addEventListener(
                "click",
                () => {

                    if (isAdmin()) {

                        showAdminPanel();

                    }
                    else {

                        showAdminLogin();

                    }

                }
            );

        }


        const saveChangesButton =
            document.getElementById(
                "Admin-Save-Changes"
            );


        if (saveChangesButton) {

            saveChangesButton.addEventListener(
                "click",
                () => {

                    saveAdminChanges();

                }
            );

        }


        const loginSubmit =
            document.getElementById(
                "Admin-Login-Submit"
            );


        if (loginSubmit) {

            loginSubmit.addEventListener(
                "click",
                () => {

                    const username =
                        document.getElementById(
                            "Admin-Username"
                        )?.value.trim();


                    const password =
                        document.getElementById(
                            "Admin-Password"
                        )?.value;


                    const error =
                        document.getElementById(
                            "Admin-Login-Error"
                        );


                    if (
                        username === ADMIN_USERNAME &&
                        password === ADMIN_PASSWORD
                    ) {

                        sessionStorage.setItem(
                            ADMIN_SESSION_KEY,
                            "true"
                        );


                        document.getElementById(
                            "Admin-Login-Overlay"
                        )?.classList.add(
                            "hidden"
                        );


                        document.getElementById(
                            "Admin-Username"
                        ).value = "";


                        document.getElementById(
                            "Admin-Password"
                        ).value = "";


                        showAdminPanel();

                    }
                    else if (error) {

                        error.textContent =
                            "Incorrect username or password.";

                        error.classList.remove(
                            "hidden"
                        );

                    }

                }
            );

        }


        const loginClose =
            document.getElementById(
                "Admin-Login-Close"
            );


        if (loginClose) {

            loginClose.addEventListener(
                "click",
                () => {

                    document.getElementById(
                        "Admin-Login-Overlay"
                    )?.classList.add(
                        "hidden"
                    );

                }
            );

        }


        const panelClose =
            document.getElementById(
                "Admin-Panel-Close"
            );


        if (panelClose) {

            panelClose.addEventListener(
                "click",
                hideAdminPanel
            );

        }


        const logout =
            document.getElementById(
                "Admin-Logout"
            );


        if (logout) {

            logout.addEventListener(
                "click",
                () => {

                    sessionStorage.removeItem(
                        ADMIN_SESSION_KEY
                    );

                    hideAdminPanel();

                }
            );

        }


        const newPlace =
            document.getElementById(
                "Admin-New-Place"
            );


        if (newPlace) {

            newPlace.addEventListener(
                "click",
                () => openPlaceEditor()
            );

        }


        const resetPlaces =
            document.getElementById(
                "Admin-Reset-Places"
            );

        if (resetPlaces) {

            resetPlaces.addEventListener(
                "click",
                () => {

                    const confirmed = window.confirm(
                        "Reset all place cards to the original default places? This will replace the current place list."
                    );

                    if (!confirmed) {
                        return;
                    }

                    const resetPlacesList =
                        DEFAULT_PLACES.map(place => ({
                            ...place
                        }));

                    saveJSON(
                        PLACES_LIBRARY_KEY,
                        resetPlacesList
                    );

                    document.getElementById(
                        "Admin-Place-Form"
                    )?.classList.add("hidden");

                    renderAdminPlaces();

                    showAdminMessage(
                        "Admin-Save-Status",
                        "Place cards have been reset to the default places. ❤️",
                        false
                    );

                    window.dispatchEvent(
                        new CustomEvent(
                            "dateAppPlacesUpdated"
                        )
                    );

                }
            );

        }


        const placeList =
            document.getElementById(
                "Admin-Places-List"
            );


        if (placeList) {

            placeList.addEventListener(
                "click",
                event => {

                    const editButton =
                        event.target.closest(
                            ".Admin-Edit-Place"
                        );


                    const deleteButton =
                        event.target.closest(
                            ".Admin-Delete-Place"
                        );


                    if (editButton) {

                        openPlaceEditor(
                            Number(
                                editButton.dataset.index
                            )
                        );

                    }


                    if (deleteButton) {

                        const places =
                            getPlacesLibrary();

                        const index =
                            Number(
                                deleteButton.dataset.index
                            );


                        if (places.length <= 1) {

                            window.alert(
                                "You need at least one place card."
                            );

                            return;

                        }


                        const confirmed =
                            window.confirm(
                                `Remove ${places[index]?.name || "this place"}?`
                            );


                        if (!confirmed) {
                            return;
                        }


                        places.splice(
                            index,
                            1
                        );


                        saveJSON(
                            PLACES_LIBRARY_KEY,
                            places
                        );


                        renderAdminPlaces();

                        window.dispatchEvent(
                            new CustomEvent(
                                "dateAppPlacesUpdated"
                            )
                        );

                    }

                }
            );

        }


        const placeCancel =
            document.getElementById(
                "Admin-Place-Cancel"
            );


        if (placeCancel) {

            placeCancel.addEventListener(
                "click",
                () => {

                    document.getElementById(
                        "Admin-Place-Form"
                    )?.classList.add(
                        "hidden"
                    );

                }
            );

        }


        const placeForm =
            document.getElementById(
                "Admin-Place-Form"
            );


        if (placeForm) {

            placeForm.addEventListener(
                "submit",
                async event => {

                    event.preventDefault();


                    const places =
                        getPlacesLibrary();


                    const indexValue =
                        document.getElementById(
                            "Admin-Place-Index"
                        ).value;


                    const index =
                        indexValue === ""
                            ? -1
                            : Number(indexValue);


                    let image =
                        placeForm.dataset.currentImage || "";


                    const imageFile =
                        document.getElementById(
                            "Admin-Place-Image"
                        ).files[0];


                    if (imageFile) {

                        if (
                            imageFile.size >
                            3 * 1024 * 1024
                        ) {

                            showAdminMessage(
                                "Admin-Place-Message",
                                "Image is too large. Please use an image under 3 MB.",
                                true
                            );

                            return;

                        }


                        image =
                            await readFileAsDataURL(
                                imageFile
                            );

                    }


                    if (!image) {

                        image =
                            "places/placeholder1.jpg";

                    }


                    const existingPlace =
                        index >= 0
                            ? places[index]
                            : null;

                    const place = {

                        id:
                            existingPlace?.id ||
                            `admin-place-${Date.now()}`,

                        name:
                            document.getElementById(
                                "Admin-Place-Name"
                            ).value.trim(),

                        image,

                        short:
                            document.getElementById(
                                "Admin-Place-Short"
                            ).value.trim(),

                        full:
                            document.getElementById(
                                "Admin-Place-Full"
                            ).value.trim(),

                        budget:
                            document.getElementById(
                                "Admin-Place-Budget"
                            ).value.trim(),

                        activities:
                            document.getElementById(
                                "Admin-Place-Activities"
                            ).value.trim(),

                        vibe:
                            document.getElementById(
                                "Admin-Place-Vibe"
                            ).value.trim()

                    };


                    if (index >= 0) {

                        places[index] =
                            place;

                    }
                    else {

                        places.push(
                            place
                        );

                    }


                    saveJSON(
                        PLACES_LIBRARY_KEY,
                        places
                    );


                    renderAdminPlaces();

                    showAdminMessage(
                        "Admin-Place-Message",
                        "Place saved successfully! ❤️",
                        false
                    );


                    placeForm.classList.add(
                        "hidden"
                    );


                    window.dispatchEvent(
                        new CustomEvent(
                            "dateAppPlacesUpdated"
                        )
                    );

                }
            );

        }


        const musicForm =
            document.getElementById(
                "Admin-Music-Form"
            );


        if (musicForm) {

            musicForm.addEventListener(
                "submit",
                async event => {

                    event.preventDefault();


                    const name =
                        document.getElementById(
                            "Admin-Music-Name"
                        ).value.trim();


                    const file =
                        document.getElementById(
                            "Admin-Music-File"
                        ).files[0];


                    const url =
                        document.getElementById(
                            "Admin-Music-URL"
                        ).value.trim();


                    if (
                        !file &&
                        !url
                    ) {

                        showAdminMessage(
                            "Admin-Music-Message",
                            "Choose an audio file or enter a direct audio URL.",
                            true
                        );

                        return;

                    }


                    if (
                        file &&
                        file.size >
                        8 * 1024 * 1024
                    ) {

                        showAdminMessage(
                            "Admin-Music-Message",
                            "Music file is too large. Please use an audio file under 8 MB.",
                            true
                        );

                        return;

                    }


                    const source =
                        file
                            ? await readFileAsDataURL(file)
                            : url;


                    const library =
                        getMusicLibrary();


                    library.push({

                        id:
                            `music_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,

                        name,

                        source

                    });


                    saveJSON(
                        MUSIC_LIBRARY_KEY,
                        library
                    );


                    renderAdminMusic();
                    populateMusicChooser();


                    document.getElementById(
                        "Admin-Music-Form"
                    ).reset();


                    showAdminMessage(
                        "Admin-Music-Message",
                        "Music added successfully! 🎵",
                        false
                    );

                }
            );

        }


        const musicList =
            document.getElementById(
                "Admin-Music-List"
            );


        if (musicList) {

            musicList.addEventListener(
                "click",
                event => {

                    const button =
                        event.target.closest(
                            ".Admin-Delete-Music"
                        );


                    if (!button) {
                        return;
                    }


                    const id =
                        button.dataset.id;

                    const library =
                        getMusicLibrary();


                    const nextLibrary =
                        library.filter(
                            track =>
                                track.id !== id
                        );


                    saveJSON(
                        MUSIC_LIBRARY_KEY,
                        nextLibrary
                    );


                    if (
                        localStorage.getItem(
                            MUSIC_CHOICE_KEY
                        ) === id
                    ) {

                        localStorage.removeItem(
                            MUSIC_CHOICE_KEY
                        );

                        backgroundMusic.pause();
                        backgroundMusic.removeAttribute(
                            "src"
                        );
                        backgroundMusic.load();

                    }


                    renderAdminMusic();
                    populateMusicChooser();

                }
            );

        }


        const avatarList =
            document.getElementById(
                "Admin-Avatar-List"
            );


        if (avatarList) {

            avatarList.addEventListener(
                "change",
                async event => {

                    const input =
                        event.target.closest(
                            ".Admin-Avatar-File"
                        );


                    if (!input) {
                        return;
                    }


                    const file =
                        input.files[0];


                    const key =
                        input.dataset.avatarKey;


                    if (!file || !key) {
                        return;
                    }


                    if (
                        file.size >
                        3 * 1024 * 1024
                    ) {

                        window.alert(
                            "Avatar image is too large. Please use an image under 3 MB."
                        );

                        input.value = "";
                        return;

                    }


                    const dataURL =
                        await readFileAsDataURL(
                            file
                        );


                    localStorage.setItem(
                        `dateAppAvatar_${key}`,
                        dataURL
                    );


                    renderAdminAvatars();

                    window.dispatchEvent(
                        new CustomEvent(
                            "dateAppAvatarUpdated",
                            {
                                detail: { key }
                            }
                        )
                    );

                }
            );


            avatarList.addEventListener(
                "click",
                event => {

                    const button =
                        event.target.closest(
                            ".Admin-Reset-Avatar"
                        );


                    if (!button) {
                        return;
                    }


                    const key =
                        button.dataset.avatarKey;


                    if (!key) {
                        return;
                    }


                    localStorage.removeItem(
                        `dateAppAvatar_${key}`
                    );


                    renderAdminAvatars();

                    window.dispatchEvent(
                        new CustomEvent(
                            "dateAppAvatarUpdated",
                            {
                                detail: { key }
                            }
                        )
                    );

                }
            );

        }


        // Close overlays by clicking the backdrop.
        [
            "Admin-Login-Overlay",
            "Admin-Panel-Overlay"
        ].forEach(
            id => {

                const overlay =
                    document.getElementById(
                        id
                    );

                if (!overlay) {
                    return;
                }

                overlay.addEventListener(
                    "click",
                    event => {

                        if (
                            event.target ===
                            overlay
                        ) {

                            overlay.classList.add(
                                "hidden"
                            );

                        }

                    }
                );

            }
        );

    }


    function showAdminMessage(
        id,
        message,
        isError
    ) {

        const element =
            document.getElementById(id);


        if (!element) {
            return;
        }


        element.textContent =
            message;

        element.classList.toggle(
            "error",
            Boolean(isError)
        );

        element.classList.remove(
            "hidden"
        );

    }


    function readFileAsDataURL(file) {

        return new Promise(
            (resolve, reject) => {

                const reader =
                    new FileReader();


                reader.onload = () =>
                    resolve(
                        reader.result
                    );

                reader.onerror = () =>
                    reject(
                        reader.error
                    );

                reader.readAsDataURL(
                    file
                );

            }
        );

    }


    // Refresh current avatar without requiring a page reload.
    window.addEventListener(
        "dateAppAvatarUpdated",
        () => {

            avatarNormal =
                getConfiguredAvatar(
                    "normal",
                    "character/asking_avatar.png"
                );

            avatarSad =
                getConfiguredAvatar(
                    "sad",
                    "character/sad_avatar.png"
                );

            avatarHappy =
                getConfiguredAvatar(
                    "happy",
                    "character/happy_avatar.png"
                );

            avatarExcited =
                getConfiguredAvatar(
                    "excited",
                    "character/excited_avatar.png"
                );

            avatarPlead =
                getConfiguredAvatar(
                    "plead",
                    "character/plead_avatar.png"
                );

            avatarDesperate =
                getConfiguredAvatar(
                    "desperate",
                    "character/desperate_avatar.png"
                );

            avatarAngry =
                getConfiguredAvatar(
                    "angry",
                    "character/angry_avatar.png"
                );

            avatarYey =
                getConfiguredAvatar(
                    "yey",
                    "character/yey_avatar.png"
                );


            noAvatars = [
                avatarSad,
                avatarSad,
                avatarPlead,
                avatarPlead,
                avatarDesperate,
                avatarDesperate,
                avatarAngry,
                avatarAngry
            ];


            const currentAvatar =
                document.querySelector(
                    ".avatar img"
                );


            if (currentAvatar) {

                currentAvatar.src =
                    avatarNormal;

            }

        }
    );


    // If admin UI was already open, refresh the music chooser/list.
    window.addEventListener(
        "dateAppMusicUpdated",
        () => {
            populateMusicChooser();
            renderAdminMusic();
        }
    );


    initializeMusic();
    createAdminUI();
    setupAdminEvents();

})();



