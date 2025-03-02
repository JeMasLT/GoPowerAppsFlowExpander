const EXPAND_BUTTON_SELECTOR = 'button[aria-label="Expand"], div[role="button"][aria-label*="Expand"]';
//const COLLAPSE_PARENT_SELECTOR = 'div[role="button"][aria-label="False condition, collapse"]';
const COLLAPSE_PARENT_SELECTOR = 'div[role="button"]';
const FIT_VIEW_BUTTON_SELECTOR = 'button[aria-label="fit view"]';
const FEEDBACK_BUTTON_SELECTOR = "button[data-automation-id='feedback']";
const MENU_BAR_SELECTOR = "div[role='menubar']";
const WAIT_TIME = 500;

function showInProgressDialog() {
    let dialog = document.createElement("div");
    dialog.id = "inProgressDialog";
    dialog.textContent = "Expanding in progress...";
    dialog.style.position = "fixed";
    dialog.style.top = "50%";
    dialog.style.left = "50%";
    dialog.style.transform = "translate(-50%, -50%)";
    dialog.style.backgroundColor = "black";
    dialog.style.color = "white";
    dialog.style.padding = "60px";
    dialog.style.borderRadius = "10px";
    dialog.style.fontSize = "18px";
    dialog.style.fontWeight = "bold";
    dialog.style.zIndex = "10000";
    document.body.appendChild(dialog);
}

function hideInProgressDialog() {
    let dialog = document.getElementById("inProgressDialog");
    if (dialog) {
        document.body.removeChild(dialog);
    }
}

function expandAll(initialCall = false) {
    if (initialCall) {
        showInProgressDialog();
    }
    
    let expandButtons = document.querySelectorAll(EXPAND_BUTTON_SELECTOR);
    
    if (expandButtons.length > 0) {
        expandButtons.forEach(button => {
            button.click();
            let parentDiv = button.closest(COLLAPSE_PARENT_SELECTOR);
            if (parentDiv) {
                parentDiv.click();
            }
            setTimeout(triggerFitView, WAIT_TIME);
        });
        setTimeout(expandAll, WAIT_TIME);
    } else {
        hideInProgressDialog();
    }
}

function triggerFitView() {
    let fitViewButton = document.querySelector(FIT_VIEW_BUTTON_SELECTOR);
    if (fitViewButton) {
        fitViewButton.click();
    }
}

function insertButton() {
    let controlsPanel = document.querySelector(".react-flow__panel.react-flow__controls");
    if (!controlsPanel || document.getElementById("goExpandButton")) return;
    
    let goExpandButton = document.createElement("button");
    goExpandButton.id = "goExpandButton";
    goExpandButton.className = "react-flow__controls-button";
    goExpandButton.setAttribute("aria-label", "Expand All");
    goExpandButton.setAttribute("title", "Expand All");
    goExpandButton.style.backgroundColor = "#83BD09"; // Set background color

    
    let goExpandIcon = document.createElement("img");
    goExpandIcon.src = chrome.runtime.getURL("goexpander.svg");
    goExpandIcon.alt = "Go Expand All";
    goExpandIcon.style.width = "24px";
    goExpandIcon.style.height = "24px";
    
    goExpandButton.appendChild(goExpandIcon);
    goExpandButton.addEventListener("click", () => expandAll(true));
    
    controlsPanel.appendChild(goExpandButton);
}

let observer = new MutationObserver(insertButton);
observer.observe(document.body, { childList: true, subtree: true });

insertButton();
