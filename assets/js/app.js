const cl = console.log

const spinner = document.getElementById('spinner')

const BASE_URL = `https://jsonplaceholder.typicode.com`
const POST_URL = `${BASE_URL}/posts`

const postForm = document.getElementById('postForm')
const titleControl = document.getElementById('title')
const bodyControl = document.getElementById('body')
const userIdControl = document.getElementById('userId')
const addPostBtn = document.getElementById('addPostBtn')
const updatePostBtn = document.getElementById('updatePostBtn')

let postsArr = []
let updateId = null

function snackbar (msg, icon) {
    Swal.fire({
        title: msg,
        icon: icon,
        timer: 3000
    })
}

fetchPosts()

function createPostCards(arr) {

    const postContainer = document.getElementById('postContainer')

    let result = ''

    arr.forEach(post => {

        result += `
            <div class="col-md-3 mb-3" id='${post.id}'>

                <div class="card h-100">

                    <div class="card-header">
                        <h3>
                           ${post.title}
                        </h3>
                    </div>

                    <div class="card-body">
                    
                        <p>
                            ${post.body}
                        </p>
                        
                    </div>

                    <div class="card-footer d-flex justify-content-between">

                        <button
                            onclick="onEdit(this)"
                            class="btn btn-sm btn-outline-info"
                        >
                            Edit
                        </button>

                        <button
                            onclick="onRemove(this)"
                            class="btn btn-sm btn-outline-danger"
                        >
                            Remove
                        </button>

                    </div>

                </div>

            </div>
        `
    })

    postContainer.innerHTML = result
}


function fetchPosts () {

    spinner.classList.remove('d-none')

    let xhr = new XMLHttpRequest()

    xhr.open('GET', POST_URL)

    xhr.send(null)

    xhr.onload = function () {

        if (xhr.status >= 200 && xhr.status <= 299) {

            // API CALL SUCCESS >> Templating

            let data = JSON.parse(xhr.response)

            postsArr = [...data]

            createPostCards(data.reverse())
            spinner.classList.add('d-none')

        } else {

            // msg snackbar
            spinner.classList.add('d-none')
            snackbar('Something went wrong', 'error')

        }
    }
}


function onPostSubmit(eve) {

    eve.preventDefault()

    // POST_OBJ

    let POST_OBJ = {
        title: titleControl.value,
        body: bodyControl.value,
        userId: userIdControl.value
    }

    cl(POST_OBJ)
    // API CALL TO SAVE POST IN DB
    // Spinner Show 
    spinner.classList.remove('d-none')

    let xhr = new XMLHttpRequest()

    xhr.open('POST', POST_URL)

    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')

    xhr.send(JSON.stringify(POST_OBJ))

    xhr.onload = function () {

        if (xhr.status >= 200 && xhr.status <= 299) {

            // API CALL SUCCESS

            let res = JSON.parse(xhr.response)

            res.title = POST_OBJ.title
            res.body = POST_OBJ.body
            res.userId = POST_OBJ.userId

            postForm.reset()

            // CREATE A SINGLE CARD IN UI

            let col = document.createElement('div')
            col.className = 'col-md-3 mb-3'
            col.id = res.id

            col.innerHTML = `

                <div class="card  h-100">

                    <div class="card-header">
                        <h3>
                            ${res.title}
                        </h3>
                    </div>

                    <div class="card-body">
                        <p>
                            ${res.body}
                        </p>
                    </div>

                    <div class="card-footer d-flex justify-content-between">

                        <button
                            onclick="onEdit(this)"
                            class="btn btn-sm btn-outline-info"
                        >
                            Edit
                        </button>

                        <button
                            onclick="onRemove(this)"
                            class="btn btn-sm btn-outline-danger"
                        >
                            Remove
                        </button>

                    </div>

                </div>
            `
            const postContainer = document.getElementById('postContainer')
            postContainer.prepend(col)
            spinner.classList.add('d-none')
            snackbar(`New post with id ${res.id} created successfully !!!`, 'success')
        } else {
            // snackbar error
            spinner.classList.add('d-none')
        }
    }
     // CREATE A NEW CARD ON UI

    xhr.onerror = function () {
        // show snackbar 
        spinner.classList.add('d-none')
    } 
}

function onEdit(ele) {
    updateId = ele.closest('.col-md-3').id

    let EDIT_URL = `${BASE_URL}/posts/${updateId}`

    let xhr = new XMLHttpRequest()
    xhr.open('GET', EDIT_URL)
    xhr.send(null)

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            let res = JSON.parse(xhr.response)

            titleControl.value = res.title
            bodyControl.value = res.body
            userIdControl.value = res.userId

            addPostBtn.classList.add('d-none')
            updatePostBtn.classList.remove('d-none')
        }
    }
}

function onUpdatePost() {

    let UPDATE_OBJ = {
        title: titleControl.value,
        body: bodyControl.value,
        userId: userIdControl.value
    }

    spinner.classList.remove('d-none')

    let UPDATE_URL = `${BASE_URL}/posts/${updateId}`

    let xhr = new XMLHttpRequest()

    xhr.open('PATCH', UPDATE_URL)

    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')

    xhr.send(JSON.stringify(UPDATE_OBJ))

    xhr.onload = function () {

        if (xhr.status >= 200 && xhr.status <= 299) {

            let card = document.getElementById(updateId)

            card.querySelector('h3').innerHTML = UPDATE_OBJ.title
            card.querySelector('p').innerHTML = UPDATE_OBJ.body

            postForm.reset()

            updateId = null

            addPostBtn.classList.remove('d-none')
            updatePostBtn.classList.add('d-none')

            spinner.classList.add('d-none')

            snackbar('Post updated successfully !!!', 'success')

        } else {
            spinner.classList.add('d-none')
            snackbar('Something went wrong', 'error')
        }
    }
}

function onRemove(ele) {

    let REMOVE_ID = ele.closest('.col-md-3').id

    Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to remove this post?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Remove',
        cancelButtonText: 'Cancel'
    }).then(result => {

        if (result.isConfirmed) {

            spinner.classList.remove('d-none')

            let REMOVE_URL = `${BASE_URL}/posts/${REMOVE_ID}`

            let xhr = new XMLHttpRequest()

            xhr.open('DELETE', REMOVE_URL)

            xhr.send(null)

            xhr.onload = function () {

                if (xhr.status >= 200 && xhr.status <= 299) {

                    let card = document.getElementById(REMOVE_ID)

                    card.remove()

                    spinner.classList.add('d-none')

                    snackbar('Post removed successfully !!!', 'success')

                } else {
                    spinner.classList.add('d-none')
                    snackbar('Something went wrong', 'error')
                }
            }

            xhr.onerror = function () {
                spinner.classList.add('d-none')
                snackbar('Something went wrong', 'error')
            }
        }
    })
}

postForm.addEventListener('submit', onPostSubmit)
updatePostBtn.addEventListener('click', onUpdatePost)