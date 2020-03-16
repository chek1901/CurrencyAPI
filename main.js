const setbaseRate = "https://api.exchangeratesapi.io/latest?base=";
const latestUrl = "https://api.exchangeratesapi.io/latest";

const firstCurrency = document.querySelector('#firstChoice');
const secondCurrency = document.querySelector('#secondChoice');
const currencyText = document.querySelector('#valutaKurs');
const swapBtn = document.querySelector('#swapCurrency');
const fetchDate = document.querySelector('#fetchDate');
const amountElement = document.querySelector('#toAmount');
const resultTag = document.querySelector('#result');

//sätter startobjektet.
const currency = new ApiCurrency("EUR", "SEK");

localStorage.clear(); // kör detta så allt rensans varje gång ny sida skapas. Inte poängen med LOCAL storage men. 
MainMethod();
events();
DisplayData();

function events() {
    
    firstCurrency.addEventListener('change', () =>{

        currency.changeFirstCurrency(firstCurrency.options[firstCurrency.selectedIndex].text);
        DisplayData();

    });
    secondCurrency.addEventListener('change', () => {
        currency.changeSecondCurrency(secondCurrency.options[secondCurrency.selectedIndex].text);
        DisplayData();

    });
    amountElement.addEventListener('change', () => {

        currency.changeAmount(amountElement.value);
        DisplayData();

    });
    swapBtn.addEventListener('click', () => {

        let localCurrIndex = firstCurrency.selectedIndex;
        let localCurrName = firstCurrency.options[firstCurrency.selectedIndex].text;
        currency.changeFirstCurrency(currency.secondCurrency);

        firstCurrency.selectedIndex = secondCurrency.selectedIndex;

        currency.changeSecondCurrency(localCurrName);

        secondCurrency.selectedIndex = localCurrIndex;
        DisplayData();
    });

}

function DisplayData() {

    //Kolla i local storage innan anropen görs. 
    //Kolla om det finns en session med namnet på "firstCurrency"
        var baseRateStorage = JSON.parse(localStorage.getItem(`${currency.firstCurrency}`));

        if(baseRateStorage != null){

            let secondCurr = baseRateStorage["rates"][currency.secondCurrency];
            let amount = currency.amount;
            let result = amount*secondCurr;
            ShowTextContent(result, amount, "LocalStorage:");
            ShowConverstionRate(secondCurr);
        }
        else {
            currency.exchange()
            .then(result => {
                ShowTextContent(result, currency.amount);
            })
            .catch(err => console.log(err));
        }

        //Här ska standardvärdet per 1 HUVUDCurrency räknas ut. 
 }
function ShowTextContent(result, amount, message = "") {

    resultTag.textContent = `${message} ${amount} ${currency.firstCurrency} 
                    = ${result.toFixed(2)} ${currency.secondCurrency}`;

}
function ShowConverstionRate(secondCurr) {

    currencyText.innerHTML = `1 ${currency.firstCurrency} 
                    = ${secondCurr.toFixed(2)} ${currency.secondCurrency}`;
    
};

async function MainMethod() {

    await fetchData(latestUrl)
    .then(data => {

        let baseRateElement = document.createElement('option');
        baseRateElement.text = data.base;
        baseRateElement.selected = true;

        let baseRateElement2 = document.createElement('option');
        baseRateElement2.text = data.base;

        firstCurrency.appendChild(baseRateElement);
        secondCurrency.appendChild(baseRateElement2);

        let fetchSpanElement = document.createElement('span');
        fetchSpanElement.innerHTML = data.date
        fetchDate.appendChild(fetchSpanElement);

        var result = Object.keys(data.rates).map(function (key) {
            return [String(key), data.rates[key]];
        })

        //Populate the List from the API. 
        result.forEach(currency => {

            let element = document.createElement('option');
            element.text = currency[0];
            element.value = currency[1];

            let element2 = document.createElement('option');
            element2.text = currency[0];
            element2.value = currency[1];

            if (element2.text == "SEK") {
                element2.selected = true;
            }

            firstCurrency.appendChild(element);
            secondCurrency.appendChild(element2);
        })
    });
}
