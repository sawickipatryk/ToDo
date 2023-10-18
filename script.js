const app = () => {

    let mainContainer = null

    let tasks = []

    let searchPhrase = ''
    let isSearchPhraseFocues = false
    let sort = 'NONE'
    let filter = 'ALL'
    let nameToDoInput = ''
    let isNameToDoInputFocused = false

    const saveToLocalStorage = () => {
        const state = {
            tasks,
            searchPhrase,
            isSearchPhraseFocues,
            sort,
            filter,
            nameToDoInput,
            isNameToDoInputFocused,
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
        nameToDoInput = state.nameToDoInput
        isNameToDoInputFocused = state.isNameToDoInputFocused
    }

    const appendArray = (array, container) => {

        array.forEach((element) => {
            container.appendChild(element)
        })

    }

    const renderTask = (task) => {

        const li = document.createElement('li')
        const text = document.createTextNode(task.name)
        const textContainer = document.createElement('div')


        textContainer.appendChild(text)
        li.appendChild(text)
        return li

    }

    const renderTasks = (tasks) => {

        const ol = document.createElement('ol')

        tasks = tasks.map((task) => {
            renderTask(task)
        })

        appendArray(tasks, ol)

        return ol

    }

    const update = () => {

        mainContainer.innerHTML = ''

        saveToLocalStorage()

        const app = render()

        mainContainer.appendChild(app)

    }
    const render = () => {

        const container = document.createElement('div')

        const tasksElement = renderTasks(tasks)

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