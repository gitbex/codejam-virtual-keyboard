const Keyboard = {
    element: {
        main: null, /* main keyboard element*/
        keyContainer: null,  /* keys container*/
        keys: []   /* an array of buttons for the keys*/
    },

    eventHandlers: {
        oninput: null  /* fire off when keyboard gets input */
    },


    properties: {    /* current state of keyboards*/
        value: "",    /* current value of keyboard */
        capsLock: false,
        Shift: false
    },


    init() {   /* initialize the keyboard, this runs when page first loads */

        // Create main element, 
        this.element.main = document.createElement("div");   /* "this" is equal to Keyboard object, create div element virtually inside the JS*/
        this.element.keyContainer = document.createElement("div");

        // Setup main element, adding classes and acutal keys
        this.element.main.classList.add("keyboard");  /* add class keyboard to main div, plus add class keyboard--hidden*/
        this.element.keyContainer.classList.add("keyboard__keys");  /* add class keyboard__keys to second div*/
        this.element.keyContainer.appendChild(this._createKeys()); // add all created keys to KeyContainer

        this.element.keys = this.element.keyContainer.querySelectorAll(".keyboard__key");

        // Add to DOM
        this.element.main.appendChild(this.element.keyContainer); /* make two divs child-parent relation*/
        document.body.appendChild(this.element.main); /*  add main keyboard element to physical DOM and all inside it*/

        // let text = document.querySelectorAll(".use-keyboard-input").value;
        // text += this.properties.value

        document.querySelectorAll(".use-keyboard-input").forEach(element => {  //select every textarea
            this.press(element);
            this._triggerEvents("oninput");
            // this.changeLang()
            this.open(element.value, currentValue => {
                // console.log('test =' + currentValue);
                element.value = currentValue;
            });

        });

    },


    changeLang() {

        keyLayout2 = [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "Backspace",
            "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з",
            "CapsLock", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "Enter",
            "Shift", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".",
            " "
        ]
        if (!this.properties.Shift) {
            for (let i = 0; i < keyLayout.length; i++) {
                this.element.keys[i].innerText = keyLayout2[i]
            }

        } else {
            for (let i = 0; i < keyLayout.length; i++) {
                this.element.keys[i].innerText = keyLayout[i]
            }
        }
        this._triggerEvents("oninput");

    },
    _createKeys() {  /* this going to create all HTML for each keys*/
        const fragment = document.createDocumentFragment();  //fragment creates a virtual holder for child elements and inserts childs to the DOM

        keyLayout = [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "Backspace",
            "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
            "CapsLock", "a", "s", "d", "f", "g", "h", "j", "k", "l", "Enter",
            "Shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
            " "
        ];

        //Create HTML for an icon
        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        };
        //For each key do next 
        //let keyLayout = this.;
        keyLayout.forEach(key => {
            const keyElement = document.createElement("button");
            const insertLineBreak = ["Backspace", "p", "Enter", "з", ".", "?"].indexOf(key) !== -1; //if key equal to one of these in the array return true

            //Add attribute/classes for each keyElement which is button
            keyElement.setAttribute("type", "button");
            keyElement.classList.add("keyboard__key");
            keyElement.setAttribute("id", key);

            //Create special keys
            switch (key) {
                case "Backspace":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("backspace") //inserting icon inside button

                    keyElement.addEventListener("click", () => {  //remove last character from object value
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        this._triggerEvents("oninput");
                    })
                    break;

                case "CapsLock":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
                    keyElement.innerHTML = createIconHTML("keyboard_capslock") //inserting icon inside button

                    let listenCaps = (e) => {
                        if (e.key == key || e.button == 0) {
                            //  event.getModifierState && event.getModifierState( 'CapsLock' );
                            this._toggleCapsLock();
                            this._triggerEvents("oninput");
                            keyElement.classList.toggle("keyboard__key--activate", this.properties.capsLock);
                        }
                    }
                    keyElement.addEventListener('click', listenCaps);
                    window.addEventListener('keydown', listenCaps);
                    //  this._triggerEvents("oninput");
                    break;
                case "Enter":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("keyboard_return") //inserting icon inside button

                    keyElement.addEventListener("click", () => {
                        this.properties.value += "\n";
                        this._triggerEvents("oninput");
                    })
                    break;
                case " ":
                    keyElement.classList.add("keyboard__key--extra-wide");
                    keyElement.innerHTML = createIconHTML("space_bar") //inserting icon inside button

                    keyElement.addEventListener("click", () => {
                        this.properties.value += " ";
                        this._triggerEvents("oninput");
                    })
                    break;
                case "Shift":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("publish") //inserting icon inside button


                    let listenShift = (e) => {
                        console.log('test');
                        if (e.key == key) {
                            console.log(e.key);
                            this._toggleShift();
                            this.changeLang();
                            this._triggerEvents("oninput");
                            keyElement.classList.toggle(this.properties.Shift);
                        }
                    }
                    window.addEventListener('keydown', listenShift);

                    break;
                default:
                    keyElement.textContent = key.toLowerCase();  //inserting actual text to buttons in lower case

                    keyElement.addEventListener("click", () => {
                        //appending pressed button key text to the properties value in lower or capital case
                        //console.log(this.properties.value);
                        this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                        this._triggerEvents("oninput");
                    })
                    break;

            }
            fragment.appendChild(keyElement); //adding keyElement(buttons) into fragment 
            if (insertLineBreak) {
                fragment.appendChild(document.createElement("br")); //when insertLineBreak true insert br tag into fragment
            }
        });
        return fragment;
    },

    _triggerEvents(handlerName) {  /* this going to trigger on of the eventHandlers*/
        if (typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    _toggleCapsLock() { /* toggling the capslock mode*/
        this.properties.capsLock = !this.properties.capsLock;

        for (const key of this.element.keys) {
            if (key.childElementCount === 0) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },
    _toggleShift() { /* toggling the Shift mode*/
        this.properties.Shift = !this.properties.Shift;
        for (const key of this.element.keys) {
            // if (key.childElementCount === 0) {
            //     key.textContent = this.properties.Shift ? changeLang() : 
            // }
        }
    },
    open(initialValue, oninput) { //may not needed,   initialValue is initial value of keyboard
        this.eventHandlers.oninput = oninput;
    },

    press(textField) { //may not needed 
        // const textField = document.querySelectorAll(".use-keyboard-input");
        //this._triggerEvents("oninput");
        textField.addEventListener("keydown", (e) => {
            //this._triggerEvents("oninput");
            this.element.keys.forEach(item => {
                //  console.log(e.key)

                if (e.key == item.id) {
                    item.classList.add("keyboard__key--dark");
                    setTimeout(function () {
                        item.classList.remove("keyboard__key--dark");
                    }, 100)

                }
            })

        })

    }



};

window.addEventListener("DOMContentLoaded", function () { /*DOMcontentLoaded because there is no HTML tags for CSS to create, we run script before css*/
    Keyboard.init(); /* call init method when DOM or HTML structure loaded*/
})