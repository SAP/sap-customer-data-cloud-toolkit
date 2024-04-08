export const find_sap_horizon_Theme = function () {
    const NEW_THEME = "sap_horizon.css"
    const THEME_ID = "custom-theme-styles"
    const cssElement = document.getElementById(THEME_ID);
    if (cssElement && cssElement.href.includes(NEW_THEME)) {
        console.log("New Theme/Horizon")
        return true;
    }
    console.log("Old Theme/Sap_Fiori_#")
    return false;
}