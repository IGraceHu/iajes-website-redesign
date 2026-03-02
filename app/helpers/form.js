/* updateRequired
 * Checks if a required field is empty
 * Props:
 *     value - the new value of the input
 *     inputKey - the key of the input in formRequired
 *     formRequired - An object with keys for each required input with values true if empty and false if not
 * Returns a duplicate of formRequired with any changes in required input state
 */
export function updateRequired(value, inputKey, formRequired) {
    const updatedFormRequired = structuredClone(formRequired);
    const isEmpty = value === "" || value === null;
    updatedFormRequired[inputKey] = isEmpty;

    return updatedFormRequired;
}