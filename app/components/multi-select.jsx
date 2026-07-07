import { useState, useEffect } from "react";
import { Children } from "react";


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

        if (e.target.selectedOptions.length == 0) {
            setSelected(newSelected)
        } else {
            const clickedOptions = new Set();
            for (let option of e.target.selectedOptions) {
                clickedOptions.add(option.value);
            }
            const selectedOptions = new Set(selected).symmetricDifference(clickedOptions);
            newSelected = Array.from(selectedOptions);

            setSelected(newSelected);
        }
        
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