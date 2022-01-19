    
let list = document.getElementById('todo')

let info = localStorage.getItem('user-info')
let inf = JSON.parse(info)
if(inf.todos == undefined)
    inf.todos = []
//console.log(todos)

let add = document.querySelector('#addTodo')
let serial = 0

function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

async function fillTable(){
    let rlt = await axios.get(`http://localhost:3000/users?email=${inf.email}&password=${inf.password}`)
    console.log(inf.email,inf.password)
    //let data = JSON.stringify(rlt.data.todos)
    let todos = rlt.data[0].todos
    console.log(todos)
    if(todos == undefined)
    return

    let table = document.getElementById('todo')
    table.innerHTML = ""

    for(let i=0;i<todos.length;i++){
        
        console.log(todos[i])
        let row =   `<tr>
                        <td>${todos[i].uniq}</td>
                        <td>${todos[i].Event}</td>
                        <td>${todos[i].Time}</td>
                        <td><button type="click" id="d${i}" onclick="deleteEvent(${i});">Delete</button></td>
                        <td><button type="click" id="u${i}" onclick="updateEvent(${i});">Update</button></td>
                    </tr>`
        table.innerHTML += row
    }
}
async function addTodo(){
    //let info = JSON.parse(localStorage.getItem('user-info'))
    //console.log(info.id)
    //let result = await axios.get(`http://localhost:3000/users?email=${info.email}&password=${info.password}`)
    let des = document.getElementById('des').value
    let hr = document.getElementById('hr').value
    let mn = document.getElementById('mn').value
    //let x = document.getElementsByName('DN')
    let DN = ""
    /* for(let i=0;i<x.length;i++){
        if(x[i].checked){
            DN = x[i].value
        }
    } */
    let time = hr + ":" + mn
    console.log(time)
    
    console.log(inf.todos)
    let uniq = uuid()
    if(inf.todos == undefined){
        inf.todos = [{"Event":des,"Time":time,"uniq":uniq}]
        console.log('nah')
    }
    else{
        console.log("addin")
        inf.todos.push({"Event":des,"Time":time,"uniq":uniq})
    }
    
    console.log(inf.todos)
    let save = await axios.put(`http://localhost:3000/users/${inf.id}`,{
        name : inf.name,
        email : inf.email,
        password : inf.password,
        todos : inf.todos
    })
    localStorage.clear()
    let rlt = await axios.get(`http://localhost:3000/users?email=${inf.email}&password=${inf.password}`)

    localStorage.setItem("user-info",JSON.stringify(rlt.data[0]))
    inf = JSON.parse(localStorage.getItem('user-info'))
    fillTable()
    location.reload()

    //console.log(todos)
}

async function deleteEvent(serial){
    //e.preventDefault()
    let info = JSON.parse(localStorage.getItem('user-info'))
    console.log("reached here!!!")
    let newTodos = []
    for(let i=0;i<inf.todos.length;i++){
        if(i!=serial)
            newTodos.push(inf.todos[i])
    }
    let save = await axios.put(`http://localhost:3000/users/${info.id}`,{
        name : inf.name,
        email : inf.email,
        password : inf.password,
        todos : newTodos
    })
    localStorage.clear()
    let rlt = await axios.get(`http://localhost:3000/users?email=${inf.email}&password=${inf.password}`)

    localStorage.setItem("user-info",JSON.stringify(rlt.data[0]))
    fillTable()
    document.getElementById('view').style.display = "none"
    add.style.display = "block"
    location.reload();
}

async function buttonReact(serial){
    console.log(serial)
    let des = document.getElementById('des2').value
    let hr = document.getElementById('hr2').value
    let mn = document.getElementById('mn2').value
    let x = document.getElementsByName('DN2')
    /* let DN = ""
    for(let i=0;i<x.length;i++){
        if(x[i].checked){
            DN = x[i].value
            break
        }
    } */
    let time = hr + ":" + mn
    console.log(time)


    
    //let inf = JSON.parse(localStorage.getItem('user-info'))
    //console.log(inf)
    let newTodos = []
    let uniq = uuid()
    for(let i=0;i<inf.todos.length;i++){
        if(i!=serial)
            newTodos.push(inf.todos[i])
        else{
            newTodos.push({"Event":des,"Time":time,"uniq":uniq})
        }
    }
    console.log(newTodos)
    let save = await axios.put(`http://localhost:3000/users/${inf.id}`,{
        name : inf.name,
        email : inf.email,
        password : inf.password,
        todos : newTodos
    })
    console.log(save)

    let result = await axios.get(`http://localhost:3000/users?email=${inf.email}&password=${inf.password}`)
    if(result.status==200 && result.data.length==1){
        localStorage.clear()
        localStorage.setItem("user-info",JSON.stringify(result.data[0])) 
    }

    //localStorage.setItem("user-info",JSON.stringify(save.data))
    fillTable()
    document.getElementById('update').style.display = "none"
    location.reload();
}
function updateEvent(ser){
    serial = ser
    //e.preventDefault()
    document.getElementById('update').style.display = "block"
    add.style.display = "none"
}

fillTable()



add.addEventListener('click', (e) => {
    e.preventDefault()
    document.getElementById('view').style.display = "block"
    add.style.display = "none"
})

let addItem = document.getElementById('add')


addItem.addEventListener('click', (e) => {
    e.preventDefault()
    addTodo()
    fillTable()
    document.getElementById('view').style.display = "none"
    add.style.display = "block"
})

let updateItem = document.getElementById('add2')

updateItem.addEventListener('click',(e) => {
    e.preventDefault()
    console.log('reacdhed')
    buttonReact(serial)
    console.log('not reac')
})

function logout(){
    localStorage.clear()
}