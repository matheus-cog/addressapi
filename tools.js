module.exports = class Validation {
    constructor(){}

    isEmpty(value){
        value = value.replace(" ","");
        return !value || value == ""; 
    }

    isNumeric(value) {
        if (typeof value != "string") return false
        return !isNaN(value) && !isNaN(parseInt(value))
    }

    allCEPReplacements(cep){
        cep.replace("-","");
        cep.replace(".","");
        cep.replace(" ","");
        return cep;
    }

    isCEPValid(cep){
        return cep.match(new RegExp("[0-9]{8}"));
    }
}