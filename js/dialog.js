const dialogTriggers = document.querySelectorAll('[data-c-toggle="dialog"][data-c-target]');
const dialogStates = new Map();
const openDialogs = new Set();
const backdropStageDelays = [50, 125, 200, 275];
const backdropStageClasses = [
    "dialog-backdrop-stage-1",
    "dialog-backdrop-stage-2",
    "dialog-backdrop-stage-3",
    "dialog-backdrop-stage-4"
];

const updateBodyScrollLock = () => {
    document.body.classList.toggle("dialog-open", openDialogs.size > 0);
};

const setBackdropStage = (state, stage) => {
    state.dialog.classList.remove(...backdropStageClasses);
    if (stage > 0) {
        state.dialog.classList.add(backdropStageClasses[stage - 1]);
    }
    state.backdropStage = stage;
};

const clearBackdropTimers = (state) => {
    state.backdropTimers.forEach((timer) => clearTimeout(timer));
    state.backdropTimers.clear();
};

const scheduleBackdropStage = (state, stage, delay) => {
    const timer = window.setTimeout(() => {
        state.backdropTimers.delete(timer);
        if (state.dialog.open) {
            setBackdropStage(state, stage);
        }
    }, delay);
    state.backdropTimers.add(timer);
};

const animateBackdropOpen = (state) => {
    clearBackdropTimers(state);
    setBackdropStage(state, 0);
    if (getTransitionDuration(state.dialog) === 0) {
        setBackdropStage(state, backdropStageClasses.length);
        return;
    }

    backdropStageDelays.forEach((delay, index) => {
        scheduleBackdropStage(state, index + 1, delay);
    });
};

const animateBackdropClose = (state) => {
    clearBackdropTimers(state);
    const currentStage = state.backdropStage;
    if (currentStage === 0) {
        return;
    }

    const firstDelay = currentStage === backdropStageClasses.length ? 25 : 75;
    for (let stage = currentStage - 1; stage >= 0; stage--) {
        const delay = firstDelay + (currentStage - 1 - stage) * 75;
        scheduleBackdropStage(state, stage, delay);
    }
};

const getTransitionDuration = (element) => {
    const styles = getComputedStyle(element);
    const durations = styles.transitionDuration.split(",").map((duration) => parseFloat(duration) * (duration.trim().endsWith("ms") ? 1 : 1000));
    const delays = styles.transitionDelay.split(",").map((delay) => parseFloat(delay) * (delay.trim().endsWith("ms") ? 1 : 1000));

    return Math.max(...durations.map((duration, index) => duration + (delays[index % delays.length] ?? 0)), 0);
};

const getDialogState = (dialog) => {
    if (dialogStates.has(dialog)) {
        return dialogStates.get(dialog);
    }

    const state = {
        dialog,
        backdropStage: 0,
        backdropTimers: new Set(),
        triggers: new Set(),
        closeTimeout: null,
        openFrame: null
    };
    dialogStates.set(dialog, state);

    dialog.addEventListener("close", () => {
        openDialogs.delete(dialog);
        updateBodyScrollLock();

        if (state.closeTimeout !== null) {
            clearTimeout(state.closeTimeout);
            state.closeTimeout = null;
        }
        if (state.openFrame !== null) {
            cancelAnimationFrame(state.openFrame);
            state.openFrame = null;
        }

        clearBackdropTimers(state);
        setBackdropStage(state, 0);
        dialog.classList.remove("dialog-hidden");
        state.triggers.forEach((trigger) => trigger.setAttribute("aria-expanded", "false"));
    });

    dialog.addEventListener("cancel", (event) => {
        event.preventDefault();
        closeDialog(dialog, state);
    });

    dialog.addEventListener("submit", (event) => {
        if (event.target instanceof HTMLFormElement && event.target.method === "dialog") {
            event.preventDefault();
            closeDialog(dialog, state);
        }
    });

    return state;
};

const openDialog = (dialog, state) => {
    if (state.closeTimeout !== null) {
        clearTimeout(state.closeTimeout);
        state.closeTimeout = null;
        clearBackdropTimers(state);
        setBackdropStage(state, backdropStageClasses.length);
        dialog.classList.remove("dialog-hidden");
        state.triggers.forEach((trigger) => trigger.setAttribute("aria-expanded", "true"));
        return;
    }

    if (dialog.open) {
        return;
    }

    dialog.classList.add("dialog-hidden");
    dialog.showModal();
    animateBackdropOpen(state);
    openDialogs.add(dialog);
    updateBodyScrollLock();
    state.triggers.forEach((trigger) => trigger.setAttribute("aria-expanded", "true"));
    state.openFrame = requestAnimationFrame(() => {
        state.openFrame = null;
        if (dialog.open) {
            dialog.classList.remove("dialog-hidden");
        }
    });
};

const closeDialog = (dialog, state) => {
    if (!dialog.open || state.closeTimeout !== null) {
        return;
    }

    if (state.openFrame !== null) {
        cancelAnimationFrame(state.openFrame);
        state.openFrame = null;
        clearBackdropTimers(state);
        setBackdropStage(state, 0);
        dialog.close();
        return;
    }

    dialog.classList.add("dialog-hidden");
    animateBackdropClose(state);
    state.triggers.forEach((trigger) => trigger.setAttribute("aria-expanded", "false"));
    const transitionDuration = getTransitionDuration(dialog);
    if (transitionDuration === 0) {
        dialog.close();
        return;
    }

    state.closeTimeout = window.setTimeout(() => {
        state.closeTimeout = null;
        dialog.close();
    }, transitionDuration);
};

dialogTriggers.forEach((trigger) => {
    const targetSelector = trigger.dataset.cTarget;
    const dialog = document.querySelector(targetSelector);

    if (!(dialog instanceof HTMLDialogElement)) {
        throw new TypeError(`Dialog trigger target "${targetSelector}" must match a <dialog>.`);
    }

    const state = getDialogState(dialog);
    state.triggers.add(trigger);
    trigger.setAttribute("aria-haspopup", "dialog");
    trigger.setAttribute("aria-expanded", "false");
    if (dialog.id) {
        trigger.setAttribute("aria-controls", dialog.id);
    }

    trigger.addEventListener("click", () => openDialog(dialog, state));
});

document.querySelectorAll('[data-c-dismiss="dialog"]').forEach((dismissButton) => {
    const dialog = dismissButton.closest("dialog");

    if (dialog instanceof HTMLDialogElement) {
        const state = getDialogState(dialog);
        dismissButton.addEventListener("click", () => closeDialog(dialog, state));
    }
});
