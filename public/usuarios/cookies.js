// cookies.js
function getCookie(nombre) {
    const nombreEQ = nombre + "=";
    const partes = document.cookie.split(';');
    for (let i = 0; i < partes.length; i++) {
        let parte = partes[i];
        while (parte.charAt(0) == ' ') {
            parte = parte.substring(1);
        }
        if (parte.indexOf(nombreEQ) == 0) {
            return parte.substring(nombreEQ.length, parte.length);
        }
    }
    return "";
}

// Exporta la función para que pueda ser utilizada en otros archivos
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = getCookie;
}
