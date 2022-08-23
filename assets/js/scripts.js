for (let i = 0; i < btnNumbers.length; i++) {
    btnNumbers[i].addEventListener('click', e => onNumpadChanged(e));
}
for (let i = 0; i < btnDirections.length; i++) {
    btnDirections[i].addEventListener('click', (e) => {
        const btn = e.target;
        const direction = btn.dataset.direction;
        changeActiveMenuItem(direction);
    });
}

for (let i = 0; i < btnControls.length; i++) {
    btnControls[i].addEventListener('click', (e) => {

        const controlID = parseInt(e.target.dataset.control);
        const hasAction = getCurrentBoards().filter(({
                                                         index,
                                                         action,
                                                         contentPath
                                                     }) => index === controlID && (action !== null || contentPath !== null)).length > 0;
        const btnClasses = e.target.classList;
        const controlBoard = document.querySelector(`.control-board.board-${controlID}`);
        if (btnClasses.contains('toggled')) {
            updateScreen();
        } else if (document.querySelectorAll('.control-btn.toggled').length === 0) {
            if (hasAction) {
                btnClasses.add('toggled');
                controlBoard.classList.add('toggled');
                updateScreen(controlID);
            }
        }
    });
}

const onOpModeChanged = () => {
    const currentBoards = getCurrentBoards();
    ctrlBoards.forEach(board => board.innerHTML = null);
    currentBoards.map(({index, label, value, action}) => {
        const controlBoard = document.querySelector(`.control-board.board-${index}`);
        const controlBtn = document.querySelector(`.control-btn.control-${index}`);
        controlBoard.innerHTML =
            (label === null ? '' : `<span class='label'>${label}</span>`) +
            (value === null ? '' : `<span class='value'>${value}</span>`);
        //jQuery Required
        $(controlBtn).off('click');
        $(controlBtn).on('click', action);
    });
    updateScreen();
}

onOpModeChanged();

//on numPad changed
const onNumpadChanged = (e) => {
    const btnNumber = e.target;
    changeCHnoValue(btnNumber.innerText);
}

// on numPadEnter clicked
const onNumpadEnterClicked = () => {
    const editableNumber = document.querySelector('.number.editable');
    if (editableNumber !== null) {
        localStorage.setItem('channelNo', editableNumber.innerText);
        updateScreen();
    }
}
btnActionEnter.addEventListener('click', onNumpadEnterClicked);

//on numPadClear Clicked
const onNumpadClearClicked = () => {
    const editableNumber = document.querySelector('.number.editable');
    if (editableNumber !== null)
        editableNumber.innerText = "0";

}
btnActionClear.addEventListener('click', onNumpadClearClicked);

//on numPad backSpace Clicked
const onNumpadBackspaceClicked = () => {
    const editableNumber = document.querySelector('.number.editable');
    if (editableNumber !== null) {
        const value = editableNumber.innerText;
        if (value.length > 1)
            editableNumber.innerText = value.substring(0,value.length-1);
        else
            editableNumber.innerText = "0";
    }
}
btnActionBackspace.addEventListener('click',onNumpadBackspaceClicked);


const onBtnHomeClicked = () => {
    CURRENT_MODE = MODE_DSC;
    onOpModeChanged();
}
document.querySelector('.action-btn.action-home').addEventListener('click', onBtnHomeClicked);


// keyboard events

const changeCHnoValue = (value) => {
    const editableNumber = document.querySelector('.number.editable');
    if (editableNumber !== null) {
        const editableValue = parseFloat(editableNumber.innerText);
        if (editableValue === 0)
            editableNumber.innerText = value;
        else
            editableNumber.innerText += value;
    }
}

const changeActiveMenuItem = (direction) => {
    const menu = document.querySelector('#menu-options');
    if (menu !== null) {
        const activeChild = document.querySelector('.menu .menu-item.focus');
        if (menu.classList.contains('vertical')) {
            if (direction === 'ArrowDown' && activeChild.nextElementSibling !== null) {
                activeChild.classList.remove('focus');
                activeChild.nextElementSibling.classList.add('focus');
            }
            if (direction === 'ArrowUp' && activeChild.previousElementSibling !== null) {
                activeChild.classList.remove('focus');
                activeChild.previousElementSibling.classList.add('focus');
            }
        } else if (menu.classList.contains('horizontal')) {
            if (direction === 'ArrowRight' && activeChild.nextElementSibling !== null) {
                activeChild.classList.remove('focus');
                activeChild.nextElementSibling.classList.add('focus');
            }
            if (direction === 'ArrowLeft' && activeChild.previousElementSibling !== null) {
                activeChild.classList.remove('focus');
                activeChild.previousElementSibling.classList.add('focus');
            }
        }
    }
}

document.addEventListener('keydown', (e) => {
    const value = e.key;
    if ([1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(n => n.toString()).includes(value))
        changeCHnoValue(value);
    if (['Up','Left','Right','Down'].map(s => `Arrow${s}`).includes(value))
        changeActiveMenuItem(value);
    // if (value==='Enter')
    //     onNumpadEnterClicked();
    if (value==='Backspace')
        onNumpadBackspaceClicked();

});