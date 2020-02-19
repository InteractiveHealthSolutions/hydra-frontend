
export const authenticationGenerator = {
    generateAuthenticationToken
};
function generateAuthenticationToken(username,password) {
    
    return 'Basic '+window.btoa(username +':' + password);
}