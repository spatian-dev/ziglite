/**
 * Checks whether the given value is a string
 *
 * @param {*} value
 * @returns {Boolean} True if the given value is a string, false otherwise
 */
export const isString = (value) => {
	return ((value === 'string') || (value instanceof String))
}

/**
 * Coerce the given value into a string and checks if it's a blank string.
 * @param {*} value
 * @returns {Boolean} True if the given value is not a blank string, false otherwise
 */
export const isBlank = (value) => {
	if (!isString(value))
        value = String(value);
    return value.trim().length === 0;
}

/**
 * Adds a trailing slash to a string if it doesn't have it
 * @param {String} str
 * @returns {String}
 */
export const ensureTrailingSlash = (str) => {
	return str.replace(/\/*$/, '/');
}

/**
 * Removes a trailing slash from a string if it has it
 * @param {String} str
 * @returns {String}
 */
export const ensureNoTrailingSlash = (str) => {
	return str.replace(/\/+$/, '');
}
