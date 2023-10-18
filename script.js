const app = () => {

    let mainContainer = null

    let tasks = []

    let searchPhrase = ''
    let isSearchPhraseFocues = false
    let sort = 'NONE'
    let filter = 'ALL'
    let taskToDoInput = ''
    let istaskToDoInputFocused = false

    const saveToLocalStorage = () => {
        const state = {
            tasks,
            searchPhrase,
            isSearchPhraseFocues,
            sort,
            filter,
            taskToDoInput,
            istaskToDoInputFocused,
        }

        localStorage.setItem('tasks', JSON.stringify(state))
    }
    const loadFromLocalStorage = () => {

        const state = JSON.parse(localStorage.getItem('tasks'))

        if (!state) return

        tasks = state.tasks
        searchPhrase = state.searchPhrase
        isSearchPhraseFocues = state.isSearchPhraseFocues
        sort = state.sort
        filter = state.filter
        taskToDoInput = state.taskToDoInput
        istaskToDoInputFocused = state.istaskToDoInputFocused
    }
    const sortDescending = (taskA, taskB) => {
        return -(taskA.name.localeCompare(taskB.name))
    }
    const sortAscending = (taskA, taskB) => {
        return (taskA.name.localeCompare(taskB.name))
    }
    const sortNone = (taskA, taskB) => { return 0 }

    const focus = (input, condition) => {
        if (condition) {
            setTimeout(() => {
                input.focus()
            }, 0)
        }
    }

    const appendArray = (array, container) => {

        array.forEach((element) => {
            container.appendChild(element)
        })

    }
    const renderInput = (placeholder, onChange, value, condition, className) => {

        const input = document.createElement('input')
        input.className = 'todo-list__input'
        if (className) {
            input.className = `todo-list__input ${className}`
        }
        input.value = value

        input.addEventListener('input', onChange)

        input.setAttribute('placeholder', placeholder)

        focus(input, condition)

        return input

    }
    const renderButton = (label, onClick, className) => {

        const button = document.createElement('button')
        button.className = 'todo-list__button'
        if (className) {
            button.className = `todo-list__button ${className}`
        }
        if (onClick) {
            button.addEventListener('click', onClick)
        }
        button.innerText = label

        return button

    }
    const addTask = (newTaskFromInput) => {

        if (!newTaskFromInput) return

        const newTaskFromInputWithCapitalizeFirstLetter = newTaskFromInput.charAt(0).toUpperCase() + newTaskFromInput.slice(1)


        const newTask = {
            name: newTaskFromInputWithCapitalizeFirstLetter,
            isCompleted: false,
            id: Date.now()
        }

        tasks = tasks.concat(newTask)

        taskToDoInput = ''

        update()

    }
    const onClickButtonDelete = (idToRemove) => {

        tasks = tasks.filter((task) => {
            return task.id !== idToRemove
        })

        update()

    }
    const onClickTaskToCompleted = (idToCompleted) => {

        tasks = tasks.map((task) => {

            if (task.id !== idToCompleted) return task

            return {

                name: task.name,
                isCompleted: !task.isCompleted,
                id: task.id

            }

        })

        update()

    }
    const onChangeTaskInput = (e) => {
        isSearchPhraseFocues = false
        istaskToDoInputFocused = true
        taskToDoInput = e.target.value
        update()
    }
    const onChangeSearchInput = (e) => {
        isSearchPhraseFocues = true
        istaskToDoInputFocused = false
        searchPhrase = e.target.value
        update()
    }
    const filterBySearchPhrase = (task) => {

        const taskToUpperCase = task.name.toUpperCase()
        const searchPhraseToUpperCase = searchPhrase.toUpperCase()

        if (taskToUpperCase.includes(searchPhraseToUpperCase)) return true

        return false

    }
    const filterByCompleted = (task) => {

        if (filter === 'ALL') return task

        if (filter === 'DONE') return task.isCompleted

        if (filter === 'NOT-DONE') return !task.isCompleted

        return true
    }
    const onFilterChange = (filterValue) => {
        filter = filterValue

        update()
    }
    const onSortChange = (sortValue) => {
        sort = sortValue

        update()
    }
    const onSubmitNewTaskForm = (e) => {
        e.preventDefault()
        addTask(taskToDoInput)
    }

    const renderTask = (task, onClick, onDelete) => {

        const li = document.createElement('li')
        const wrapper = document.createElement('div')
        const textContainer = document.createElement('div')


        li.className = 'todo-list__item-task'
        wrapper.className = 'todo-list__item-task-wrapper'
        textContainer.className = 'todo-list__list-item-text-container'

        if (task.isCompleted) {
            textContainer.className = `${textContainer.className} todo-list__item-task--completed`
        }

        li.addEventListener('click', onClick)

        const text = document.createTextNode(task.name)

        const deleteButton = renderButton('X', onDelete)


        textContainer.appendChild(text)
        wrapper.appendChild(textContainer)
        wrapper.appendChild(deleteButton)
        li.appendChild(wrapper)

        return li

    }

    const renderTasks = (tasks) => {

        const ol = document.createElement('ol')
        ol.className = 'todo-list__tasks-container'

        tasks = tasks.map((task) => {
            return renderTask(
                task,
                () => { onClickTaskToCompleted(task.id) },
                () => { onClickButtonDelete(task.id) }
            )
        })

        appendArray(tasks, ol)

        return ol

    }

    const renderForm = () => {

        const form = document.createElement('form')
        form.className = 'todo-list__form'

        const inputForm = renderInput(
            'Type your task',
            onChangeTaskInput,
            taskToDoInput,
            istaskToDoInputFocused,
            'todo-list__new-task-input')

        const buttonForm = renderButton('ADD',
            null,
            'todo-list__button-add')

        form.addEventListener('submit', onSubmitNewTaskForm)

        form.appendChild(inputForm)
        form.appendChild(buttonForm)

        return form

    }
    const renderSearch = () => {

        const container = document.createElement('div')
        container.className = 'todo-list__search-input--container'

        const searchInput = renderInput('Type your searching',
            onChangeSearchInput,
            searchPhrase,
            isSearchPhraseFocues,
            'todo-list__search-input')

        container.appendChild(searchInput)

        return container

    }
    const renderFilterButton = (filterValue, activeFilter) => {
        let className = 'todo-list__button todo-list__button--filter'

        if (filterValue === activeFilter) {
            className = `${className} todo-list__button--filter-active`
        }


        return renderButton(
            filterValue,
            () => { onFilterChange(filterValue) },
            className
        )

    }
    const renderFilters = (activeFilter) => {

        const container = document.createElement('div')
        container.className = 'todo-list__filters-container'

        const buttonAll = renderFilterButton('All', activeFilter)
        const buttonDone = renderFilterButton('DONE', activeFilter)
        const buttonNotDone = renderFilterButton('NOT-DONE', activeFilter)

        container.appendChild(buttonAll)
        container.appendChild(buttonDone)
        container.appendChild(buttonNotDone)

        return container

    }
    const renderSortButton = (SortValue, activeSort) => {
        let className = 'todo-list__button todo-list__button--sort'

        if (SortValue === activeSort) {
            className = `${className} todo-list__button--sort-active`
        }


        return renderButton(
            SortValue,
            () => { onSortChange(SortValue) },
            className
        )

    }
    const renderSort = (activeSort) => {

        const container = document.createElement('div')
        container.className = 'todo-list__sort-container'

        const buttonAll = renderSortButton('NONE', activeSort)
        const buttonDone = renderSortButton('ASCENDING', activeSort)
        const buttonNotDone = renderSortButton('DESCENDING', activeSort)

        container.appendChild(buttonAll)
        container.appendChild(buttonDone)
        container.appendChild(buttonNotDone)

        return container

    }

    const update = () => {

        mainContainer.innerHTML = ''

        saveToLocalStorage()

        const app = render()

        mainContainer.appendChild(app)

    }
    const render = () => {

        const container = document.createElement('div')
        container.className = 'todo-list__container'

        const filteredTasks = tasks
            .filter(filterBySearchPhrase)
            .filter(filterByCompleted)

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

        const formElement = renderForm()
        const filtersElement = renderFilters(filter)
        const sortElement = renderSort(sort)
        const searchElement = renderSearch()
        const tasksElement = renderTasks(sortedTasks)

        container.appendChild(formElement)
        container.appendChild(filtersElement)
        container.appendChild(sortElement)
        container.appendChild(searchElement)
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

}