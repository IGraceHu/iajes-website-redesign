import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(',');

function getFocusableElements(container) {
    if (!container) return [];
    return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR))
        .filter((element) => !element.hasAttribute('disabled') && element.offsetParent !== null);
}

function useDialogFocus(show, dialogRef, onClose) {
    useEffect(() => {
        if (!show) return undefined;

        const previouslyFocused = document.activeElement;
        const focusDialog = () => {
            const focusable = getFocusableElements(dialogRef.current);
            (focusable[0] || dialogRef.current)?.focus();
        };

        window.setTimeout(focusDialog, 0);

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                onClose();
                return;
            }

            if (event.key !== "Tab") return;

            const focusable = getFocusableElements(dialogRef.current);
            if (focusable.length === 0) {
                event.preventDefault();
                dialogRef.current?.focus();
                return;
            }

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            if (previouslyFocused && typeof previouslyFocused.focus === "function") {
                previouslyFocused.focus();
            }
        };
    }, [show, dialogRef, onClose]);
}

// POPUP -----------------------------------------------------------------------
// PARAMETERS
// id - Unique ID for the popup. Ensures that popups from different components do not overlap
//      There should only be one Popup component used in a component. 
//
// show - Determines if the popup is visible or not
//
// setShow - set function for show
//
// buttons - Optional. An array of objects with properties 'text' and 'onclick'
//     text - Required. A string with the button text
//     onclick - Required. A function that clicking the button will execute
//     className - Optional
//
// closePopup - Optional. A function that runs when the close button is clicked.
//     Note: This does not apply to closeOnBlur. If the user clicks outside of the popup, it will just close normally
//
// stayOnBlur - Optional. Defaults to false. Determines if clicking outside the popup will close the popup or not

export function Popup({ id, className, label, show, setShow, buttons, closePopup = null, stayOnBlur = false, nested = false, children }) {

    const popupId = "popup-" + id;
    const dialogRef = useRef(null);

    function defaultClosePopup() {
        setShow(false);
    }

    const handleClosePopup = closePopup || defaultClosePopup;

    useDialogFocus(show, dialogRef, handleClosePopup);

    useEffect(() => {
        if (show) {
            const popupContEl = document.getElementById(popupId);
            const popupEl = popupContEl.children[0].children[0];
            popupContEl.classList.remove("invisible");
            popupContEl.classList.remove("opacity-0");
            popupEl.classList.remove("mt-10");

            // Compensate for when scrollbar is visible lmao
            if (!nested) {
                if (document.body.clientHeight > window.innerHeight) {
                    document.body.style.overflow = "hidden";
                    document.body.style.paddingRight = "15px";
                }
            }
        } else {
            const popupContEl = document.getElementById(popupId);
            const popupEl = popupContEl.children[0].children[0];
            popupContEl.classList.add("opacity-0");
            popupContEl.classList.add("invisible");
            popupEl.classList.add("mt-10");

            // Return scrollbar after popup disappears
            if (!nested) {
                setTimeout(() => { document.body.style.overflow = "auto"; document.body.style.paddingRight = "0"; }, 200);
            }
        }
    }, [show, nested, popupId])


    const buttonsEl = [];
    let i = 0;
    if (buttons) {
        buttons.map((button) => {
            let btnId = "popup-" + id + "-button-" + i;
            buttonsEl.push(<button key={btnId} id={btnId} className={"button mx-2 " + button?.className} onClick={button.onclick}>{button.text}</button>);
            i++;
        })
    }

    return (
        <div id={popupId} className="fixed top-0 left-0 size-full flex items-center justify-center duration-200 z-999 invisible opacity-0" aria-hidden={!show}>
            <div className="z-1">
                <div
                    ref={dialogRef}
                    role="dialog"
                    aria-modal="true"
                    aria-label={label || "Dialog"}
                    tabIndex="-1"
                    className={"mt-10 min-w-lg max-w-[90vw] min-h-50 max-h-[85vh] p-4 bg-white rounded-md shadow-md duration-200 flex flex-col justify-between " + className}
                >
                    <div className="overflow-y-auto overflow-x-hidden w-full relative">
                        {children}
                    </div>
                    <div className="bottom-0 mt-4 flex justify-center shrink-0 grow-0">
                        {buttonsEl}
                        <button type="button" className="button button-light mx-2" onClick={handleClosePopup}>Close</button>
                    </div>
                </div>
            </div>

            <div className="absolute size-full bg-black opacity-40 z-0" onClick={() => { if (!stayOnBlur) { defaultClosePopup() } }} aria-hidden="true"></div>
        </div>
    )
}

// POPUPFORM -----------------------------------------------------------------------
// PARAMETERS
// id - Unique ID for the popup. Ensures that popups from different components do not overlap
//      There should only be one Popup component used in a component. 
//
// show - Determines if the popup is visible or not
//
// setShow - set function for show
//
// validate - Required. A function with paramters formData that runs when the form is submitted
// 
// hasError - Optional. Default is false

export function PopupForm({ id, className, label, show, setShow, validate, hasError, nested = false, children, encType }) {
    // const [state, formAction] = useActionState(saveForm, {});

    const popupId = "popup-" + id;
    const formRef = useRef(null);

    function closePopup() {
        setShow(false);
    }

    useDialogFocus(show, formRef, closePopup);

    useEffect(() => {
        if (show) {
            const popupContEl = document.getElementById(popupId);
            const popupEl = popupContEl.children[0].children[0];
            popupContEl.classList.remove("invisible");
            popupContEl.classList.remove("opacity-0");
            popupEl.classList.remove("mt-10");

            const formEl = document.getElementById(popupId + "-form");
            formEl.reset();
            formEl.children[0].scrollTo(0, 0);


            // Compensate for when scrollbar is visible lmao
            if (!nested) {
                if (document.body.clientHeight > window.innerHeight) {
                    document.body.style.overflow = "hidden";
                    document.body.style.paddingRight = "15px";
                }
            }
        } else {
            const popupContEl = document.getElementById(popupId);
            const popupEl = popupContEl.children[0].children[0];
            popupContEl.classList.add("opacity-0");
            popupContEl.classList.add("invisible");
            popupEl.classList.add("mt-10");

            // Return scrollbar after popup disappears
            if (!nested) {
                setTimeout(() => { document.body.style.overflow = "auto"; document.body.style.paddingRight = "0"; }, 200);
            }
        }
    }, [show, nested, popupId])

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        validate(formData)
    }

    return (
        <div id={popupId} className="fixed top-0 left-0 size-full flex items-center justify-center duration-200 z-999 invisible opacity-0" aria-hidden={!show}>
            <div className="z-1">
                <form
                    ref={formRef}
                    id={popupId + "-form"}
                    encType={encType}
                    onSubmit={handleSubmit}
                    role="dialog"
                    aria-modal="true"
                    aria-label={label || "Form dialog"}
                    tabIndex="-1"
                    className={"mt-10 min-w-lg max-w-[90vw] min-h-50 max-h-[85vh] p-4 bg-white rounded-md shadow-md duration-200 flex flex-col justify-between " + className}
                >
                    <div className="overflow-y-auto overflow-x-hidden w-full relative">
                        {children}
                    </div>
                    <div className="h-25 flex flex-col justify-end">
                        {hasError &&
                            <p className="text-error text-center my-2">An error occurred. Please try again later.</p>
                        }
                        <div className="bottom-0 mt-4 flex justify-center shrink-0 grow-0">
                            <input id="popup-form-submit" type="submit" className="button mx-2" value="Save" />
                            <button key="popup-close-default" type="button" className="button button-light mx-2" onClick={closePopup}>Cancel</button>
                        </div>
                    </div>
                </form>
            </div>

            <div className="absolute size-full bg-black opacity-40 z-0" aria-hidden="true"></div>
        </div>
    )
}
