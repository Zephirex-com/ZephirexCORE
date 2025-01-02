// market.js

export class market {
    constructor(baseName, quoteName){

        this.name = baseName + "-" + quoteName;
        this.baseName = baseName;
        this.quoteName = quoteName;
        this.ask = Infinity;
        this.bid = -Infinity;
    }
}