const addButton = $('#addButton');
const addUserContainer = $('.addUserContainer');
const searchInput = $('#searchInput');
const paginationBtns = $('#paginationBtns');
const searchForm = $('#searchForm');
const tableBody = $('tbody');
const pagination = $('#pagination');
const rowDetails = $('#rowDetails');
const headRow = $('thead > tr');
const addForm = $('#addUserForm');
const select = $('select');

addForm.addEventListener('submit', (e) => table.addUser(e));

addButton.addEventListener('click', () => {
    addUserContainer.classList.toggle('none');
});

headRow.addEventListener('click', (e) => {
    const tdDataset = e.target.dataset;
    table.sortUsersByProp(
        table.users,
        tdDataset.prop,
        tdDataset.orderDirection
    );
    tdDataset.orderDirection = tdDataset.orderDirection === '' ? '1' : '';
});

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    table.filterUsers(
        searchInput.value,
        select.options[select.selectedIndex].value
    );
});

class Table {
    jsonToXml(jsonData) {
        const root = document.createElement('data');

        jsonData.forEach((user) => {
            const person = document.createElement('person');

            for (const key in user) {
                if (user.hasOwnProperty(key)) {
                    if (key === 'address') {
                        const address = document.createElement(key);
                        const addressData = user[key];

                        for (const addressKey in addressData) {
                            if (addressData.hasOwnProperty(addressKey)) {
                                const element =
                                    document.createElement(addressKey);
                                element.textContent = addressData[addressKey];
                                address.appendChild(element);
                            }
                        }

                        person.appendChild(address);
                    } else {
                        const element = document.createElement(key);
                        element.textContent = user[key];
                        person.appendChild(element);
                    }
                }
            }

            root.appendChild(person);
        });

        return new XMLSerializer().serializeToString(root);
    }

    xmlToJsObj(xmlString) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
        const rootElement = xmlDoc.documentElement;

        function xmlElementToObject(element) {
            const obj = {};
            for (let i = 0; i < element.children.length; i++) {
                const child = element.children[i];
                obj[child.tagName] = child.textContent;
            }
            return obj;
        }

        const result = [];
        for (let i = 0; i < rootElement.children.length; i++) {
            const childElement = rootElement.children[i];
            result.push(xmlElementToObject(childElement));
        }

        return result;
    }

    async getUsers(large) {
        let url =
            'http://www.filltext.com/?rows=32&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&address=%7BaddressObject%7D&description=%7Blorem%7C32%7D​';

        if (large) {
            url =
                'http://www.filltext.com/?rows=1000&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&delay=3&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&address=%7BaddressObject%7D&description=%7Blorem%7C32%7D';
        }
        let data = await fetch(url);
        let jsonData = await data.json();
        const xmlString = this.jsonToXml(jsonData);
        return this.xmlToJsObj(xmlString);
    }

    constructor() {
        this.users = [];
        this.currentPageCount = 1;
        this.getUsers(true)
            .then((users) => {
                this.users = users;
            })
            .catch(console.log)
            .finally(() => {
                table.displayData();
                table.createPageBtns();
            });
        console.log(this.users);
    }

    addUser(e) {
        e.preventDefault();
        const formObj = {};
        Array.from(addForm.elements).forEach((input) => {
            if (input.id) {
                formObj[input.id] = input.value;
            }
        });
        this.users.unshift(formObj);
        this.displayData();
    }

    sortUsersByProp(users, prop, descending) {
        const sortedUsers = users.sort((a, b) => {
            a = a[prop];
            b = b[prop];
            if (descending) {
                [a, b] = [b, a];
            }
            if (typeof a === 'object' && typeof b === 'object') {
                return a.streetAddress.localeCompare(b.streetAddress);
            }
            if (!isNaN(a)) {
                return a - b;
            }
            if (typeof a === 'string') {
                return a.localeCompare(b);
            }
            return 0;
        });
        this.displayData(sortedUsers);
        return sortedUsers;
    }

    displayData(users = this.users) {
        tableBody.innerHTML = '';

        users.slice(0, 50).forEach((user) => {
            const tr = document.createElement('tr');

            for (let key in user) {
                const td = document.createElement('td');

                if (typeof user[key] === 'object') {
                    td.innerText = Object.values(user[key]).join(' ');
                } else {
                    td.innerText = user[key];
                }

                tr.append(td);
            }

            tr.addEventListener('click', (e) => {
                let lastTdOfTr = e.currentTarget.lastElementChild;
                let addressTd = lastTdOfTr.previousElementSibling;
                let whiteSpace = lastTdOfTr.style.whiteSpace;
                whiteSpace = whiteSpace === 'unset' ? 'nowrap' : 'unset';
                lastTdOfTr.style.whiteSpace = whiteSpace;
                addressTd.style.whiteSpace = whiteSpace;
            });

            tableBody.appendChild(tr);
        });
    }

    filterUsers(searchText, option) {
        searchText = searchText?.toLowerCase();
        const filteredUsers = this.users.filter((user) => {
            if (
                typeof user[option] !== 'object' &&
                String(user[option]).toLowerCase().includes(searchText)
            ) {
                return true;
            }
            if (
                typeof user[option] === 'object' &&
                new RegExp(searchText, 'gi').test(
                    Object.values(user[option]).join(' ')
                )
            ) {
                return true;
            }
            return false;
        });
        this.displayData(filteredUsers);
    }

    changePage(pageNr) {
        let current = Number(this.currentPageCount);
        const x = 50;
        if (!isNaN(pageNr)) {
            this.currentPageCount = Number(pageNr);
            pageNr = pageNr * x;
            return this.displayData(this.users.slice(pageNr - x, pageNr));
        }
        if (pageNr === '<< Back' && current > 1) {
            current--;
            this.displayData(this.users.slice((current - 1) * x, current * x));
        }
        if (
            pageNr === 'Next >>' &&
            current < Math.ceil(this.users.length / x)
        ) {
            current++;
            this.displayData(this.users.slice((current - 1) * x, current * x));
        }
        this.currentPageCount = current;
    }

    createPageBtns() {
        paginationBtns.innerHTML = '';
        for (let i = 0; i < Math.ceil(this.users.length / 50); i++) {
            const btn = document.createElement('button');
            btn.classList.add('change-page');
            btn.innerText = i + 1;
            paginationBtns.append(btn);
        }
        pagination.addEventListener('click', (e) => {
            table.changePage(e.target.innerText);
        });
    }
}

const table = new Table();
