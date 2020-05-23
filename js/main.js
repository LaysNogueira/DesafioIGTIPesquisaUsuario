let users = [];
let pesquisa;
let btnPesquisar;
let usersFiltrados;
let filtrados;
let estatistica;
let loading;

window.addEventListener('load', () => {
    pesquisa = document.querySelector('#pesquisa');
    btnPesquisar = document.querySelector('#btnPesquisar');
    filtrados = document.querySelector('.filtrados');
    estatistica = document.querySelector('.estatistica');
    loading = document.querySelector('.loading');

    getUsers();

    btnPesquisar.addEventListener('click', searchUsers);    
});

async function getUsers() {
    startLoading();
    const response = await fetch('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo');
    users = await response.json();
    finishLoading();
}

function startLoading(){
    loading.innerHTML = 'Carregando ...'
    btnPesquisar.disabled = true;
    pesquisa.disabled = true;
}

function finishLoading(){
    loading.innerHTML = ''
    btnPesquisar.disabled = false;
    pesquisa.disabled = false;
}


function searchUsers ()  {
    usersFiltrados =  users.results.filter((user) => {
        return  user.name.first.indexOf(pesquisa.value) > -1 ||
                user.name.last.indexOf(pesquisa.value) > -1 ||
                user.name.first.indexOf(pesquisa.value.toUpperCase()) > -1 ||
                user.name.last.indexOf(pesquisa.value.toUpperCase()) > -1 ||
                user.name.first.indexOf(pesquisa.value.toLowerCase()) > -1 ||
                user.name.last.indexOf(pesquisa.value.toLowerCase()) > -1 ||
                user.name.first.indexOf(pesquisa.value[0].toUpperCase() + pesquisa.value.slice(1)) > -1||
                user.name.last.indexOf(pesquisa.value[0].toUpperCase() + pesquisa.value.slice(1)) > -1 ||
                user.name.first.indexOf(pesquisa.value[0].toLowerCase() + pesquisa.value.slice(1)) > -1 ||
                user.name.last.indexOf(pesquisa.value[0].toLowerCase() + pesquisa.value.slice(1)) > -1                
    });

    usersFiltrados.sort((a,b) => {
        if (a.name.first > b.name.first) {
            return 1;
          }
          if (a.name.first < b.name.first) {
            return -1;
          }
          return 0;
    })

    if(usersFiltrados.length < 1) usersFiltrados = null;

    renderFiltrados(usersFiltrados);
    renderEstatisticas(usersFiltrados);
    
}

function renderFiltrados(usersFiltrados) {
    if(!usersFiltrados) {
        filtrados.innerHTML = `<h2>Nenhum usuário encontrado.</h2>`
        return
    }
    filtrados.innerHTML = `<h2>${usersFiltrados.length} Usuário(s) encontrado(s)</h2>`
    usersFiltrados.forEach(user => {
        const teste =  `
        <ul>
            <img src="${user.picture.large}">
            <li>${user.name.first} ${user.name.last}, ${user.dob.age} anos</li>    
        </ul>
    `
    filtrados.innerHTML += teste;
    });
}

function renderEstatisticas(usersFiltrados) {
    if(!usersFiltrados) {
        estatistica.innerHTML = `<h2>Nada a ser exibido.</h2>`
        return;
    }

    const sexoM = usersFiltrados.filter((users) => {
        return users.gender === 'male';
    }).length;
    const sexoF = usersFiltrados.filter((users) => {
        return users.gender === 'female';
    }).length;
    const somaIdades = usersFiltrados.reduce((sum, curr) => {
        return sum + curr.dob.age;
    }, 0)
    const mediaIdades = (somaIdades / usersFiltrados.length).toFixed(2);

    estatistica.innerHTML = `<h2>Estatistícas`
    
    const teste =  `
        <ul class="estatisticaList">
            <li>Sexo Masculino: <strong>${sexoM} </strong></li>
            <li>Sexo Feminino: <strong>${sexoF} </strong></li>  
            <li>Soma das idades: <strong>${somaIdades.toLocaleString('pt-BR')} </strong></li>  
            <li>Média das idades: <strong>${mediaIdades} </strong></li>  
        </ul>
    `
    estatistica.innerHTML += teste;
    
}

