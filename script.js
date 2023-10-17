const app = (function () {
    let tasks = []
    let mainContainer = null
    let searchPhrase = ''
    let filter = 'ALL'
    let sort = 'ASCENDING'
    let isSearchInputFocused = false
    let nameToDoInput = ''
    let isNameToDoInputFocused = false

    const saveToLocalStorage = () => {

        const state = {
            tasks,
            searchPhrase,
            filter,
            sort,
            isSearchInputFocused,
            nameToDoInput,
            isNameToDoInputFocused,
        }

        localStorage.setItem('todo', JSON.stringify(state))

    }

    const loadFromLocalStorage = () => {
        const state = JSON.parse(localStorage.getItem('todo'))

        if (!state) return

        tasks = state.tasks
        searchPhrase = state.searchPhrase
        filter = state.filter
        sort = state.sort
        isSearchInputFocused = state.isSearchInputFocused
        nameToDoInput = state.nameToDoInput
        isNameToDoInputFocused = state.isNameToDoInputFocused

    }


    const generateTimestampId = () => {
        return Date.now() + '-' + Math.round(Math.random() * 1000000)
    }

    const sortDescending = function (taskA, taskB) {
        return -(taskA.name.localeCompare(taskB.name))
    }
    const sortAscending = function (taskA, taskB) {
        return taskA.name.localeCompare(taskB.name)
    }
    const sortNone = function (taskA, taskB) { return 0 }

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
    const onClickToogleTask = (idToToggle) => {

        tasks = tasks.map((task) => {
            if (task.id !== idToToggle) return task

            return {
                name: task.name,
                isCompleted: !task.isCompleted,
                id: task.id
            }
        })

        update()

    }
    const onClickDeleteButton = (idToDelete) => {

        tasks = tasks.filter((task) => {
            return task.id !== idToDelete
        })

        update()

    }
    const onFilterChange = (filterValue) => {
        filter = filterValue
        update()
    }
    const onSortChange = (sortValue) => {
        sort = sortValue
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
            isCompleted: false,
            id: generateTimestampId()
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

    const renderInput = (placeholder, onChange, value, className, condition) => {

        const input = document.createElement('input')
        input.className = className

        input.value = value

        input.setAttribute('placeholder', placeholder)

        input.addEventListener('input', onChange)

        focus(condition, input)

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

        const newTasks = tasks.map((task) => {
            return renderTask(
                task,
                () => { onClickToogleTask(task.id) },
                () => { onClickDeleteButton(task.id) }
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
            'todo-list__input',
            isNameToDoInputFocused
        )

        form.appendChild(formInput)
        form.appendChild(formButton)

        return form

    }
    const renderSearchInput = (onChange) => {

        const container = document.createElement('div')
        container.className = 'todo-list__search'
        const searchInput = renderInput('Type your searching phrase', onChange, searchPhrase, 'todo-list__input', isSearchInputFocused)

        // focus(isSearchInputFocused, searchInput)

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
        container.classList = 'todo-list__filters'

        const buttonAll = renderFilterButton('ALL', activeFilter)
        const buttonDone = renderFilterButton('DONE', activeFilter)
        const buttonNotDone = renderFilterButton('NOT-DONE', activeFilter)

        container.appendChild(buttonAll)
        container.appendChild(buttonDone)
        container.appendChild(buttonNotDone)

        return container

    }
    const renderSortButton = (sortValue, activeSort) => {

        let className = 'todo-list__button todo-list__button--sort'
        if (sortValue === activeSort) {
            className = className + ' todo-list__button--sort-active'
        }

        return renderButton(
            sortValue,
            () => { onSortChange(sortValue) },
            className
        )
    }
    const renderSortButtons = (activeSort) => {

        const container = document.createElement('div')
        container.classList = 'todo-list__sort'

        const buttonNone = renderSortButton('NONE', activeSort)
        const buttonAscending = renderSortButton('ASCENDING', activeSort)
        const buttonDescending = renderSortButton('DESCENDING', activeSort)

        container.appendChild(buttonNone)
        container.appendChild(buttonAscending)
        container.appendChild(buttonDescending)

        return container

    }
    const update = () => {

        mainContainer.innerHTML = ''

        const app = render()

        saveToLocalStorage()

        mainContainer.appendChild(app)

    }
    const render = () => {

        const container = document.createElement('div')

        const filteredTasks = tasks
            .filter(filteredBySearch)
            .filter(filteredByCompleted)

        const sortedTasks = filteredTasks
            .slice()
            .sort((taskA, taskB) => {
                if (sort === 'NONE') {
                    return sortNone(taskA, taskB)
                }
                if (sort === 'ASCENDING') {
                    return sortAscending(taskA, taskB)
                }
                return sortDescending(taskA, taskB)
            })

        const tasksElement = renderTasks(sortedTasks)
        const formElement = renderForm(onSubmitNewNameForm, onChangeNewNameInput)
        const searchElement = renderSearchInput(onChangeSearchInput)
        const filterElement = renderFilter(filter)
        const sortsElement = renderSortButtons(sort)

        container.appendChild(formElement)
        container.appendChild(searchElement)
        container.appendChild(filterElement)
        container.appendChild(sortsElement)
        container.appendChild(tasksElement)

        return container

    }
    const init = (containerSelector = 'body') => {

        const container = document.querySelector(containerSelector)

        if (!container) {
            console.error('Type correct container')
        }
        mainContainer = container

        loadFromLocalStorage()

        const app = render()

        container.appendChild(app)

    }
    return init
})()

