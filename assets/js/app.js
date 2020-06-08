const createState = (state) => {
    return new Proxy(state, {
        set(target, property, value) {
            target[property] = value; // default set behaviour
            render(property); // updates the view every time the state changes
            return true;
        }
    });
};

const state = createState({
    cardnumber: '',
    expirydate: '',
    ccv: ''
});


var cardnumberel = document.querySelector('[data-model="cardnumber"]'),
    expirydateel = document.querySelector('[data-model="expirydate"]'),
    ccvel = document.querySelector('[data-model="ccv"]');

const render = (property) => {
    document.querySelector(`[data-model=${property}]`).value = state[property];
};

const listener = (event) => {
    const {
        type,
        value,
        dataset
    } = event.target;
    state[dataset.model] = type == 'date' ? value : value;
    if (dataset.model == 'cardnumber' && state['cardnumber'] != '') {
        ValidateCreditCardNumber(value);
    }
    else if(dataset.model == 'ccv' && state['ccv'] != '') {
        validateCCV(value);
    }
    else if(dataset.model == 'expirydate' && state['expirydate'] != '') {
        validateDate(value);
    }

    console.log(expirydateel.valid, ccvel.valid, cardnumberel.valid);
    if(expirydateel.valid === true &&  ccvel.valid === true && cardnumberel.valid === true){
        document.getElementById('submit').disabled = false;
    } else {
        document.getElementById('submit').disabled = true;
    }
};


function validateDate(date){
    const el = document.getElementById('datemessage');
    var currdate = new Date();
    var date = new Date(date);
    if(currdate > date) {
        expirydateel.valid = false;
        el.innerHTML = 'Date should grater than today';
        el.classList.remove('is-success');
        el.classList.add('is-danger');
    } else {
        expirydateel.valid = true;
        el.innerHTML = 'Valid Date';
        el.classList.remove('is-danger');
        el.classList.add('is-success');
    }
}

function validateCCV(ccv){
    console.log('values:', ccv);
    const el = document.getElementById('ccvmessage');
    console.log('length:', ccv.toString().length)
    if ( ccv.toString().length < 3 ) {
        ccvel.valid = false;
        el.innerHTML = 'Alteast 3 digit';
        el.classList.remove('is-success');
        el.classList.add('is-danger');
    } else {
        ccvel.valid = true;
        el.innerHTML = 'Valid CCV';
        el.classList.remove('is-danger');
        el.classList.add('is-success');
    }
}

function ValidateCreditCardNumber(ccNum) {
    // var ccNum = document.getElementById("cardNum").value;
    var visaRegEx = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/,
        mastercardRegEx = /^(?:5[1-5][0-9]{14})$/,
        amexpRegEx = /^(?:3[47][0-9]{13})$/,
        discovRegEx = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
    var message = '',
        isValid = false,
        type = '';
    switch (true) {
        case visaRegEx.test(ccNum):
            isValid = true;
            type = 'visa';
            message = 'Valid Visa Card';
            break;
        case mastercardRegEx.test(ccNum):
            isValid = true;
            type = 'mastercard';
            message = 'Valid Master Card';
            break;
        case amexpRegEx.test(ccNum):
            isValid = true;
            type = 'amex';
            message = 'Valid Amexp Card';
            break;
        case discovRegEx.test(ccNum):
            isValid = true;
            type = 'discover';
            message = 'Valid Discover Card';
            break;
        default:
            message = 'Not a valid card format';
       
    }
    const messageelement = document.getElementById('cardnumbermessage');
    messageelement.innerHTML = message;
    if (isValid == true) {
        cardnumberel.valid = true;
        expirydateel.disabled = false;
        ccvel.disabled = false;
        messageelement.classList.remove('is-danger');
        messageelement.classList.add('is-success');
        document.getElementById('cardicon').innerHTML = `<i class="fab fa-cc-${type}"></i>`;
    } else {
        document.querySelector('[data-model="cardnumber"]').valid = false;
        messageelement.classList.remove('is-success');
        messageelement.classList.add('is-danger');
        expirydateel.disabled = true;
        ccvel.disabled = true;
        document.getElementById('cardicon').innerHTML = `<i class="fas fa-credit-card"></i>`;
    }
}

cardnumberel.addEventListener('keyup', listener);
expirydateel.addEventListener('input', listener);
ccvel.addEventListener('keyup', listener);

const submitForm = () => {
    let targetValue = Object.assign({}, state);
    SaveDataToLocalStorage(targetValue);
}


// Object.observe(state, function(changes) {
//     console.log('state:', changes);
// });

function SaveDataToLocalStorage(data) {
    var storagedata;
    storagedata = localStorage.getItem('items') === null ? [] : JSON.parse(localStorage.getItem('items'));
    storagedata.push(data);
    localStorage.setItem('items', JSON.stringify(storagedata));
}


const loadData = () => {
    var html = '';
    var datasets = JSON.parse(localStorage.getItem('items'));
    if (datasets != null) {
        datasets.forEach((item, i) => {
            html += `<tr>
            <td>${item.cardnumber}</td>
            <td>${item.expirydate}</td>
            <td>${btoa(item.ccv)}</td>
            <td><a href="javascript:void(0)" onclick="deleteItem(${i})"><i class="fas fa-trash" aria-hidden="true"></i></a></td>
            </tr>`;
        });
    } else {
        html += `<tr>
         <td colspan="4" rowspan="4" class="has-text-centered"> No data Avalible </td>
         </tr>`;
    }
    document.getElementById('loaddata').innerHTML = html;
}
loadData();

const deleteItem = (i) => {
    var storagedata;
    console.log('index:', i);
    storagedata = JSON.parse(localStorage.getItem('items'));
    storagedata.splice(i, 1);
    localStorage.setItem('items', JSON.stringify(storagedata));
    location.reload();
}

function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}