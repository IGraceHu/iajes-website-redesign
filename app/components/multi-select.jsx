import { useState } from "react";


export function MultiSelect({
    id = "",
    className = "",
    value = null,
    defaultValue = null,
    autoComplete = null,
    autoFocus = false,
    children,
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
    const [selected, setSelected] = useState(value);
    const [isChanged, setIsChanged] = useState(false);

    // console.log(children);
    function onChangeSelf(e) {
        setIsChanged(true);
        e.preventDefault;
        
        if (e.target.selectedOptions.length == 0) {
            setSelected([])
        } else {
            const clickedOptions = new Set();
            for (let option of e.target.selectedOptions) {
                clickedOptions.add(option.value);
            }
            // console.log(selected);
            // console.log(clickedOptions);
            const selectedOptions = clickedOptions.symmetricDifference(new Set(selected));
            // console.log("symdiff");
            // console.log(selectedOptions);


            setSelected(Array.from(selectedOptions));
        }
        
        onChange(e);
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
                    setSelected([])
                }
            }
        }
    }

    function onInputSelf(e) {
        console.log(e);
    }

    function onInvalidSelf(e) {
        console.log(e);
    }

    return (
        <div>
            <div>

            </div>
            <select
                multiple
                id = {id}
                className = {"multi-select " + className}
                value = {selected}
                defaultValue = {defaultValue}
                autoComplete = {autoComplete}
                autoFocus = {autoFocus}
                disabled = {disabled}
                form = {form}
                name = {name}
                onChange = {onChangeSelf}
                onChangeCapture = {onChangeCapture}
                onInput = {onInputSelf}
                onInvalid = {onInvalidSelf}
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