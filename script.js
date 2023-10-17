let tasks = [
    {
        name: 'Zmyc naczynia',
        isCompleted: false
    },
    {
        name: 'Zmyc podloge',
        isCompleted: true
    },
]
let mainContainer = null
let searchPhrase = ''
let filter = 'ALL'
let isSearchInputFocused = false
let nameToDoInput = ''
let isNameToDoInputFocused = false

const focus = (condition, element) => {
    if (condition) {
        setTimeout(() => {
            element.focus()
        }, 0)
    }

}
const appendArray = (array, container) => {
    array.forEach((element) => {
        container.appendChild(element)
    })
}
const onClickToogleTask = (indexToToggle) => {

    tasks = tasks.map((task, index) => {
        if (index !== indexToToggle) return task

        return {
            name: task.name,
            isCompleted: !task.isCompleted
        }
    })

    update()

}
const onClickDeleteButton = (indexToDelete) => {

    tasks = tasks.filter((task, index) => {
        return index !== indexToDelete
    })

    update()

}
const onFilterChange = (filterValue) => {
    filter = filterValue
    update()
}
const filteredByCompleted = (task) => {

    if (filter === 'ALL') return task
    if (filter === 'DONE') return task.isCompleted
    if (filter === 'NOT-DONE') return !task.isCompleted

    return true
}
const filteredBySearch = (task) => {

    const name = task.name.toUpperCase()
    const search = searchPhrase.toUpperCase()

    if (name.includes(search)) return true

    return false
}
const addNewTask = (newName) => {

    const newTask = {
        name: newName,
        isCompleted: false
    }

    nameToDoInput = ''

    tasks = tasks.concat(newTask)

}
const onSubmitNewNameForm = (e) => {
    e.preventDefault()
    addNewTask(nameToDoInput)
    update()

}
const onChangeNewNameInput = (e) => {
    isSearchInputFocused = false
    isNameToDoInputFocused = true
    console.log(e.target.value)
    nameToDoInput = e.target.value
    update()
}
const onChangeSearchInput = (e) => {
    isSearchInputFocused = true
    isNameToDoInputFocused = false
    searchPhrase = e.target.value
    update()
}
const renderButton = (label, onClick, className) => {

    const button = document.createElement('button')
    button.className = className
    button.innerText = label

    if (onClick) {
        button.addEventListener('click', onClick)
    }


    return button

}

const renderInput = (placeholder, onChange, value, className) => {

    const input = document.createElement('input')
    input.className = className

    input.value = value

    input.setAttribute('placeholder', placeholder)

    focus(isNameToDoInputFocused, input)
    input.addEventListener('input', onChange)


    return input

}
const renderTask = (task, onToggle, onDelete) => {

    const li = document.createElement('li')
    li.className = 'todo-list__list-item'

    if (task.isCompleted) {
        li.className = li.className + ' todo-list__list-item--completed'
    }

    const wrapper = document.createElement('div')
    wrapper.className = 'todo-list__list-item-wrapper'

    const textContainer = document.createElement('span')
    textContainer.className = 'todo-list__list-item-text-container'

    const text = document.createTextNode(task.name)
    li.addEventListener('click', onToggle)

    const buttonDelete = renderButton('X', onDelete, 'todo-list__button todo-list__button--delete')


    textContainer.appendChild(text)
    wrapper.appendChild(textContainer)
    wrapper.appendChild(buttonDelete)
    li.appendChild(wrapper)

    return li

}
const renderTasks = (tasks) => {

    const ol = document.createElement('ol')

    const newTasks = tasks.map((task, index) => {
        return renderTask(
            task,
            () => { onClickToogleTask(index) },
            () => { onClickDeleteButton(index) }
        )
    })
    appendArray(newTasks, ol)

    return ol

}
const renderForm = (onSubmit, onInput) => {

    const form = document.createElement('form')
    form.className = 'todo-list__form'

    form.addEventListener('submit', onSubmit)

    const formButton = renderButton(
        'ADD',
        null,
        'todo-list__button'
    )
    const formInput = renderInput(
        'Type your task',
        onInput,
        nameToDoInput,
        'todo-list__input'
    )

    form.appendChild(formInput)
    form.appendChild(formButton)

    return form

}
const renderSearchInput = (onChange) => {

    const container = document.createElement('div')
    container.className = 'todo-list__search'
    const searchInput = renderInput('Type your searching phrase', onChange, searchPhrase, 'todo-list__input')

    focus(isSearchInputFocused, searchInput)

    container.appendChild(searchInput)
    return container

}
const renderFilterButton = (filterValue, activeFilter) => {

    let className = 'todo-list__button todo-list__button--filter'
    if (filterValue === activeFilter) {
        className = className + ' todo-list__button--filter-active'
    }

    return renderButton(
        filterValue,
        () => { onFilterChange(filterValue) },
        className
    )
}
const renderFilter = (activeFilter) => {

    const container = document.createElement('div')

    const buttonAll = renderFilterButton('ALL', activeFilter)
    const buttonDone = renderFilterButton('DONE', activeFilter)
    const buttonNotDone = renderFilterButton('NOT-DONE', activeFilter)

    container.appendChild(buttonAll)
    container.appendChild(buttonDone)
    container.appendChild(buttonNotDone)

    return container

}
const update = () => {

    mainContainer.innerHTML = ''

    const app = render()

    mainContainer.appendChild(app)

}
const render = () => {

    const container = document.createElement('div')

    const filteredTasks = tasks
        .filter(filteredBySearch)
        .filter(filteredByCompleted)

    const tasksElement = renderTasks(filteredTasks)
    const formElement = renderForm(onSubmitNewNameForm, onChangeNewNameInput)
    const searchElement = renderSearchInput(onChangeSearchInput)
    const filterElement = renderFilter(filter)

    container.appendChild(formElement)
    container.appendChild(searchElement)
    container.appendChild(filterElement)
    container.appendChild(tasksElement)

    return container

}
const init = (containerSelector) => {

    const container = document.querySelector(containerSelector)

    if (!container) {
        console.error('Type correct container')
    }
    mainContainer = container

    const app = render()

    container.appendChild(app)

}
init('.root')