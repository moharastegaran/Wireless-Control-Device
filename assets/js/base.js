const btnNumbers = document.getElementsByClassName("number-btn");
const btnDirections = document.getElementsByClassName("direction-btn");
const btnControls = document.getElementsByClassName("control-btn");
const ctrlBoards = document.querySelectorAll(".control-board");
const btnActionClear = document.querySelector(".action-btn.action-clear");
const btnActionEnter = document.querySelector(".action-btn.action-enter");
const btnActionBackspace = document.querySelector('.action-btn.action-backspace');

const MODE_MANUAL = "MAN";
const MODE_MANUAL_2 = "MAN2";
const MODE_DSC = "DSC";

let CURRENT_MODE = MODE_DSC;
let current__mode = null;

const MENU__OP_MODE = "opMode";
const MENU__MODE = "mode";
const MENU__POWER = "powMode";
const MENU__BW = "bwMode";

const getCurrentBoards = () => screenModes.filter(({mode}) => mode === CURRENT_MODE)[0].boards;

const updateScreen = (expectedIndex = 1) => {
    const board = getCurrentBoards().filter(({index}) => index === expectedIndex)[0];
    if (board.contentPath)
        fetch(board.contentPath).then(response => response.text())
            .then(text => document.getElementById('screen-board').innerHTML = text)
            .then(() => {
                const channel = document.querySelector('#channel-no');
                if (channel) channel.innerText = localStorage.getItem('channelNo')
            });

    if (expectedIndex === 1)
        document.querySelectorAll('.toggled').forEach(item => item.classList.remove('toggled'))
};

const toggleMenu = (type, options, activeItem = 0) => {
    const menu = document.querySelector('.menu');
    if (menu !== null)
        return;

    const optionsHTML = options.map((option, index) => `<a class='menu-item ${index === activeItem ? 'focus' : ''}' href='javascript:onMenuItemClicked("${type}","${option.toLowerCase()}")'>${option}</a>`);
    document.getElementById('screen-board').innerHTML +=
        `<div id='menu-options' class='menu menu-bottom-right vertical'>
                ${optionsHTML.join("")}
         </div>`;
}

const switchBooleanMenu = (menuId) => {
    document.querySelectorAll('.toggled').forEach(element => element.classList.remove('toggled'))
    document.querySelector(`#${menuId}`).childNodes.forEach(node => {
        if (node.classList.contains('focus'))
            node.classList.remove('focus');
        else
            node.classList.add('focus');
    });
}

const setBoardValueByIndex = (index, value) => {
    if (document.querySelector(`.control-board.board-${index} .value`) === null)
        document.querySelector(`.control-board.board-${index}`).innerHTML += `<span class="value">${value}</span>`
    else
        document.querySelector(`.control-board.board-${index} .value`).innerText = value;
}


const onMenuItemClicked = (type, selectedValue) => {
    switch (type) {
        case MENU__OP_MODE :
            CURRENT_MODE = selectedValue.toUpperCase();
            onOpModeChanged();
            break;
        case MENU__MODE :
            setBoardValueByIndex(8, selectedValue);
            break;
        case MENU__POWER :
            setBoardValueByIndex(10, selectedValue);
            break;
        case MENU__BW :
            setBoardValueByIndex(10, selectedValue);
            break;
    }

    document.querySelector('#menu-options').remove();
    document.querySelectorAll('.toggled').forEach(item => item.classList.remove('toggled'))
}

const screenModes = [
    {
        mode: MODE_DSC,
        boards: [
            {
                index: 1,
                label: 'MANUAL',
                value: null,
                contentPath: 'screens/ManualMain.html',
                action: () => {
                    CURRENT_MODE = MODE_MANUAL;
                    onOpModeChanged()
                },
            }, {
                index: 10,
                label: 'OP MODE',
                value: 'MANUAL',
                action: () => toggleMenu(MENU__OP_MODE, [MODE_MANUAL, MODE_DSC]),
                contentPath: null
            }
        ]
    },
    {
        mode: MODE_MANUAL,
        boards: [
            {
                index: 1,
                label: 'MANUAL',
                value: '#1...',
                action: () => {
                    CURRENT_MODE = MODE_MANUAL_2;
                    onOpModeChanged()
                },
                contentPath: 'screens/Manual1.html'
            }, {
                index: 2,
                label: 'CHAN',
                value: 'STORE',
                action: null,
                contentPath: null
            }, {
                index: 3,
                label: 'PBT',
                value: null,
                action: null,
                contentPath: null
            }, {
                index: 4,
                label: 'CHAN',
                value: 'RECALL',
                action: null,
                contentPath: 'screens/ChanRecall.html'
            }, {
                index: 5,
                label: 'NOTCH',
                value: '-5000',
                action: null,
                contentPath: null
            }, {
                index: 6,
                label: 'FREQ',
                value: null,
                action: null,
                contentPath: 'screens/Frequency.html'
            }, {
                index: 7,
                label: 'NOTCH',
                value: 'MAN',
                action: null,
                contentPath: null
            }, {
                index: 8,
                label: 'MODE',
                value: current__mode,
                action: () => toggleMenu(MENU__MODE, ['CW', 'AME', 'FM', 'FAX', 'USB', 'LSB']),
                contentPath: null
            }, {
                index: 10,
                label: 'POWER',
                value: 'OFF',
                action: () => toggleMenu(MENU__POWER, ['OFF', 'LOW', 'MED', 'HIGH']),
                contentPath: null
            }
        ]
    },
    {
        mode: MODE_MANUAL_2,
        boards: [
            {
                index: 1,
                label: 'MANUAL',
                value: '#2...',
                action: () => {
                    CURRENT_MODE = MODE_MANUAL;
                    onOpModeChanged()
                },
                contentPath: 'screens/Manual1.html'
            }, {
                index: 2,
                label: 'CHAN',
                value: 'STORE',
                action: null,
                contentPath: null
            }, {
                index: 3,
                label: 'PREAMP',
                value: '<div id="preamp-menu" class="menu small disabled horizontal"><a class="menu-item focus">ON</a><a class="menu-item">OFF</a></div>',
                action: () => switchBooleanMenu('preamp-menu'),
                contentPath: null
            }, {
                index: 4,
                label: 'CHAN',
                value: 'RECALL',
                action: null,
                contentPath: 'screens/ChanRecall.html'
            }, {
                index: 5,
                label: 'SQUALCH',
                value: '<div id="squalch-menu" class="menu small disabled horizontal"><a class="menu-item focus">ON</a><a class="menu-item">OFF</a></div>',
                action: () => switchBooleanMenu('squalch-menu'),
                contentPath: null
            }, {
                index: 6,
                label: 'FREQ',
                value: null,
                action: null,
                contentPath: 'screens/Frequency.html'
            },
            {
                index: 7,
                label: 'NB TYPE',
                value: 'OFF',
                action: () => {
                    CURRENT_MODE = MODE_MANUAL;
                    onOpModeChanged()
                },
                contentPath: 'screens/Manual1.html'
            }, {
                index: 8,
                label: 'MODE',
                value: current__mode,
                action: () => toggleMenu(MENU__MODE, ['CW', 'AME', 'FM', 'FAX', 'USB', 'LSB']),
                contentPath: null
            }, {
                index: 10,
                label: 'BW',
                value: '50 HZ',
                action: () => toggleMenu(MENU__BW, [50, 160, 300, 400, 600, 800, 1000, 1500, 1800, 2100, 2400,
                    2700, 3100, 3700, 4500, 6000, 8000].map(number => `${number} HZ`)),
                contentPath: null
            }
        ]
    }
];