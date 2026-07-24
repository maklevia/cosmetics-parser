export const submitOnEnter = (e: React.KeyboardEvent<HTMLInputElement>, submit: () => void) => {
    if (e.key === 'Enter') {
        submit();
    }
}