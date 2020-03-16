'use strict';

class ApiCurrency {

    constructor(firstCurrency, secondCurrency) {
        this.firstCurrency = firstCurrency;
        this.secondCurrency = secondCurrency;
        this.url = "https://api.exchangeratesapi.io/latest?base=";

        this.amount = 1;
    }

     exchange() {

        //fetch & promiese
        return new Promise((resolve, reject) => {
             fetch(this.url + this.firstCurrency)
            .then(res => res.json())
            .then(data => {

                localStorage.setItem(`${this.firstCurrency}`, JSON.stringify(data));

                const thisRate = data["rates"][this.secondCurrency];
                ShowConverstionRate(thisRate);
                const amount2 = Number(this.amount);
                let total = thisRate*amount2;                
                resolve(total);
            })
            .catch(error => reject(error));

        })
    }

    changeAmount(amount) {
        this.amount = amount;
    }
    changeFirstCurrency(newCurrency) {
        this.firstCurrency = newCurrency;
    }
    changeSecondCurrency(newCurrency) {
        this.secondCurrency = newCurrency;
    }
}

async function fetchData(url) {
    
    return await fetch(url)
                .then(res => {
                
                    if(!res.ok){
                        throw new error("Woops - det blev fel!");
                    }
                    return res.json()
                });
}




