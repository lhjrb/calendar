var requestURL = 'https://lhjrb.github.io/calendar/materias.json';
var request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();

request.onload = function () {   
  const materias = request.response
  createTable(materias['materias'])
}

// Gera o prox horario de 50 em 50 min
function prox_hora(horario) {
  let hora = parseInt(horario.split(":")[0])
  let minute = parseInt(horario.split(":")[1])

  if(minute+50 >= 60){
    hora += 1
    minute -= 10
  } 
  else {
    minute += 50
  }
  return hora.toString() + ":" + (minute < 10 ? 0 + minute.toString()  : minute.toString())
}

// Ordena os Array de acordo com a hora
function compare(a, b) {
  var a = parseInt(a.hora.split(":")[0]);
  var b = parseInt(b.hora.split(":")[0]);

  return a == b ? 0 : a > b ? 1 : -1;
}
    
// Variaveis

const dia_semana = {Segunda: [], Terça: [], Quarta: [], Quinta: [], Sexta: [], Sábado: [], Domingo: []}
    
const horario = {first: "2500", last: "0", "num_aula": 0, "quantidade": 0}

let day = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"][new Date().getDay()];
const all_horario = []
var datas = []

// Organiza o Json Transformando ele no objeto dia_semana
function organiza_json(materias){
  materias.forEach((materia) => {
    materia['info'].forEach((info) => {
      if (parseInt(info['start']) > parseInt(horario['last'])){
        horario['last'] = info['start']
        horario['num_aula'] = info['aulas']
      }
      if (parseInt(info['start']) < parseInt(horario['first'])){
        horario['first'] = info['start']
      }
      dia_semana[info['week']].push({
        name: materia['name'], 
        hora: info["start"],
        sala: info["sala"],
        aulas: info["aulas"],
        turma : materia['turma']
      })
    })
  })
}
    
// Gera o Verdadeiro ult horaio de aula
function Gerar_ult_hora(){
  let ult_horario = horario.last
  for (var i = 1 ; i <= horario['num_aula'] ; i++) {ult_horario = prox_hora(ult_horario)}
  horario.last = ult_horario
}
    
// Gera a linha com todos os horarios
function Gerar_hora(){
  let text_coluna = horario.first
  const header = document.querySelector('#header')
  while ( parseInt(text_coluna.replace(":", "")) !== parseInt(horario.last.replace(":", ""))) {  
    all_horario.push(text_coluna)
    createdivdata(header, text_coluna,0,1,'hora', horario.quantidade)
    text_coluna = prox_hora(text_coluna)
    horario.quantidade += 1
  }
  const container = document.querySelector(".container")
  container.style = `--w:${800/horario.quantidade + 'px'}`
}

// Gera todas as linhas com o dia da semana e 
function gerar_linhas(){
  let line_number = 1
  for(semana in dia_semana){
    if(dia_semana[semana].length !== 0){
      const linha = createline(line_number+7)
      createdivdata(linha, semana, 0,'','dia_semana')
      for(aula of dia_semana[semana]){
        createdivdata(linha, aula['name'], all_horario.indexOf(aula['hora']), aula['aulas'])
      }
      if(semana === day){
        linha.classList.add('destaque')
      }
      line_number += 1
    }
  }
}
    
// Criar a div chamada linha
function createline(e) {  
  var container = document.querySelector('.container')
  var linha = document.createElement('div')
  linha.setAttribute('class', 'linha')   
  linha.style = `--z:${e}`
  container.append(linha)
  return linha
}
    
// Cria a div da data com todas as propriedades
function createdivdata(linha, value, left=0, quantidade=1, type=''){
  const data = document.createElement('div')
  const text_data = document.createElement('p')
  data.setAttribute("class", `data ${type}`)
  text_data.append(value)
  data.append(text_data)
  linha.append(data)
  if (type !== 'dia_semana' && type !== 'hora'){
    data.style = `--l:${left};--q:${quantidade}`
  } 
}

// Gera a tabela completa
function createTable(e){
  organiza_json(e)
  Gerar_ult_hora()
  Gerar_hora()
  gerar_linhas()
  datas = document.querySelectorAll('.data')
  datas.forEach((data) => {
    if(data.className.indexOf('dia_semana') === -1 && data.className.indexOf('hora') === -1 && data.className.indexOf('vazio') === -1){
      data.addEventListener('mouseover',handlehover)
      data.addEventListener('mouseout',handleouthover)
    }
  })
}
    
// Troca o texto e destaqua da hora do elemento hover
const handlehover = ({path}) => {
  path.pop()
  path.forEach((i) => { 
    if(i.className !== undefined && i.className.indexOf('linha') !== -1){
      index_dia_semana = i.children[0].innerText
    }
    if(i.className === 'data '){
      index_search = i.attributes.style.textContent.split(";")[0].split(":")[1]
    }
  })
  dia_semana[index_dia_semana].forEach((w) => {
    if(w.hora === all_horario[index_search]){
      for(let z = 0; z < w.aulas; z++){
        header.children[parseInt(index_search) + z + 1].classList.add('destaque')
      }
      path[0].innerText = w.sala +" / "+ w.turma
    }
  })
}

// Troca o texto e tira o destaqua da hora do elemento ao tirar o hover
const handleouthover = (e) => {
  dia_semana[index_dia_semana].forEach((i) => {
    if(i.hora === all_horario[index_search]){
      e.target.innerText = i.name
      for(let o = 0; o<i.aulas; o++){
        header.children[parseInt(index_search) + o + 1].classList.remove('destaque')
      }       
    }
  })
}

// Verificar o hover dos elementos datas
var index_dia_semana
var index_search
  
    
