import { useState, useEffect } from "react";
import { Children } from "react";

function hasTouchSupport() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

export function MultiSelect({
    id = "",
    className = "",
    value = [],
    autoComplete = null,
    autoFocus = false,
    children = [],
    disabled = false,
    form = null,
    name = "",
    onChange = () => {},
    onChangeCapture = () => {},
    onInput = () => {},
    onInvalid = () => {},
    onInvalidCapture = () => {},
    required = false,
    size = 8
}) {
    const defaultValue = value || [];
    const [selected, setSelected] = useState(defaultValue);
    const [isChanged, setIsChanged] = useState(false);

    // Okay So
    // There is a difference between how desktop handles multiselect and how mobile handles multiselect
    // Because on mobile, when you click on a select it pops up a little screen INDEPENDENT of the website itself
    // For accessibility purposes and all that
    // There are two big things that change because of this

    // 1. onClick and onChange functions fire differently
    //    On Desktop, onChange fires first, then onClick slightly after. onChange is tied to the
    //    select element, onClick is usually tied to the child option element because presumably
    //    the user is clicking on the select options
    //    On mobile, onClick fires when the user clicks on the select bar, and ONLY onChange fires
    //    whenever the user toggles one of the options. onClick DOES NOT FIRE

    // 2. onChange e.target.selectedOptions will return differently
    //    Okay technically this is not true. Technically they still work the same, however.
    //    On desktop, because this is a vanilla select, if the user is not holding down SHIFT,
    //    clicking an option will remove all other options previously picked.
    //    So the select element will be like
    //    Option 1 & 3 are selected -> User clicks Option 2 -> Option 1 & 3 are unselected and Option 2 is selected
    //    -> select returns only Option 2 because only Option 2 is selected.
    //    And we bypass this by doing set things to it via controlled element and stuff
    //    HOWEVER
    //    On mobile, because they have a much more user accessible select, the flow goes more like
    //    Option 1 & 3 are selected -> User clicks Option 2 -> Option 1, 2, & 3 are all now selected
    //    -> select returns options 1, 2, & 3
    //    Like a respectable multiselect
    //    Unfortunately this respectable behavior fricks with the bypass for the disrespectable desktop behavior

    // Yeah so no2 is a big issue. Thats why we have the hasTouchSupport function up there and down in 
    // onChangeSelf. It's not completely foolproof, but it should work for mobile devices and technically
    // doesn't break functionality if a desktop is mistaken as mobile, because then it would just be
    // vanilla behavior.


    useEffect(() => {
        // This resets the default value whenever the multiselect is rendered, aka whenever the popup appears.
        setSelected(defaultValue);
    }, []);

    const options = new Map();
    Children.map(children, child => options.set(child.props.value, child.props.children))

    function onChangeSelf(e) {
        setIsChanged(true);
        e.preventDefault;
        let newSelected = [];

        if (!hasTouchSupport()) {
            if (e.target.selectedOptions.length > 0) {
                const clickedOptions = new Set();
                for (let option of e.target.selectedOptions) {
                    clickedOptions.add(option.value);
                }
                const selectedOptions = new Set(selected).symmetricDifference(clickedOptions);
                newSelected = Array.from(selectedOptions);
                
                testclickel.innerHTML += "<br>newSelected: " + newSelected;
            }
        } else {
            for (let option of e.target.selectedOptions) {
                newSelected.push(option.value);
            }
        }

        setSelected(newSelected);
        
        onChange(newSelected);
        setTimeout(() => {
            setIsChanged(false);
        }, 0);
    }

    function toggleSingle(e) {
        if (!isChanged) {
            if (e.ctrlKey || e.metaKey) {
                return;
            }

            if (e.target.tagName === 'OPTION') {
                const clickedOption = e.target;
                
                if (selected.length === 1 && selected[0] === clickedOption.value) {
                    setSelected([]);
                    onChange([]);
                }
            }
        }
    }

    function removeOption(optionValue) {
        const optionIndex = selected.indexOf(optionValue.toString());
        if (optionIndex > -1) {
            const newSelected = selected.toSpliced(optionIndex, 1);
            setSelected(newSelected);
            onChange(newSelected);
        }
    }

    return (
        <div>
            <div className="multi-select-chips">
                {selected.map((optionValue) => {
                    if (options.get(optionValue) == null) {
                        removeOption(optionValue);
                    } else {
                        return <div key={optionValue} className="multi-select-chip" onClick={() => {removeOption(optionValue)}}>{options.get(optionValue)} <i className="bi bi-x my-auto ml-1" style={{ fontSize: "1.5rem" }}></i></div>
                    }
                })}
            </div>
            <select
                multiple
                id = {id}
                className = {"multi-select input input-text overflow-x-auto " + className}
                value = {selected}
                autoComplete = {autoComplete}
                autoFocus = {autoFocus}
                disabled = {disabled}
                form = {form}
                name = {name}
                onChange = {onChangeSelf}
                onChangeCapture = {onChangeCapture}
                onInput = {onInput}
                onInvalid = {onInvalid}
                onInvalidCapture = {onInvalidCapture}
                required = {required}
                size = {size}
                onClick={toggleSingle}
            >
                {children}
            </select>
        </div>
    );
}