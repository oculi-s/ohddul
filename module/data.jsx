
export const innerText = element => {
    if (typeof element === 'string') {
        return element;
    }
    if (Array.isArray(element)) {
        return element.map(innerText).join('');
    }
    if (element?.props?.children) {
        return innerText(element?.props?.children);
    }
    return '';
}