// Array das Horas e dos dias da Semana que posso ter aula
const horas = ["7:10", "8:00", "8:50", "9:40", "10:30", "11:20"];
const diadasemana = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"];

// Request do json com as informações pra gerar o calendario
var requestURL = 'https://lhjrb.github.io/calendar/materias.json';
var request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();

// Passa os dados e gera a tabela
request.onload = function () {
    const materias = request.response
    createtable(materias['materias'])
};

// Filtra as materias por semana
function semanaweek(materias, semana) {
    let full = [];
    // Verifica cada materia
    for (let i = 0; i < materias['length']; i++) {
        // Dentro de cada materia verifica se pertence a semana
        for (let w = 0; w < materias[i]['info']['length']; w++) {
            if (materias[i]['info'][w]['week'] === semana) {

                nome = materias[i]['name'];
                start = materias[i]['info'][w]['start'];
                aulas = materias[i]['info'][w]['aulas'];
                salas = materias[i]['info'][w]['sala'];
                full = [...full, { nome, start, aulas,salas }];

            }
        }
    }

    return full;
}

function createtd(tr, value, aulas) {
    var td = document.createElement('td');
    td.append(value);
    td.setAttribute('colspan', aulas);
    tr.append(td);
}
function createtd_void(tr, aulas) {
    var td_void = document.createElement('td');
    td_void.setAttribute('colspan', aulas);
    tr.append(td_void);
}

// Gera a Tabela
function createtable(materias) {

    // Organiza a aula da semana em ordem cronologica
    function compare(a, b) {
        var a = parseInt(a.start.split(':')[0]);
        var b = parseInt(b.start.split(':')[0]);
        return a == b ? 0 : a > b ? 1 : -1;
    }

    // Gera cada linha da tabela de acordo com os dias da semana
    for (let i = 0; i < diadasemana.length; i++) {
 

        // Gera um array com as materias por semana
        const week = semanaweek(materias, i)
        week.sort(compare)
        console.log(week)

        // Para cada semana seleciona apenas a hora de começo e gera um array delas
        let startTime = [];
        week.forEach(element => {
            startTime = [...startTime, element['start']]
        });

        
        // Copia o Array Horas
        var copyHoras = horas.slice()

        // Gerar um array contendo x e w
        // w: Tenho aula nesse horário
        // x: Não tenho aula nesse horário
        horas.forEach((element) => {
            // Verifica o prox do array
            let z = 0;
            // Verifica se horas pertence ao array startTime
            if (startTime.includes(element)) {

                // Troca as horas que tem aula por w
                copyHoras.splice(copyHoras.findIndex(w => w === element), week[z]['aulas'], 'w');
                z += 1;
            } 
            // Troca as horas que não tem aula por x
            else {
                var acharindex = copyHoras.findIndex(x => x === element);
                // verificar se o ID existe
                if (acharindex !== -1) {
                    copyHoras.splice(acharindex, 1, 'x');
                }

            }
        });

        // FALTA APARTIR DAQUI

        
        c = 0;
        x = 0;

        // Seleciona a linha do dia da semana

        var tr = document.querySelector('#' + diadasemana[i]);
        copyHoras.forEach((element, index) => {
            if (element === 'x') {
                x += 1;
                if (copyHoras[index + 1] === 'w' || copyHoras[index + 1] === undefined) {
                    createtd_void(tr, x);
                }
            } else {

                createtd(tr, `${week[c]['nome'] + " - " + week[c]['salas']}`, week[c]['aulas']);
                c += 1;
                x = 0;
            }


        });

    }
}
date = new Date().getDay();
tr_destaque = document.querySelector('#' + diadasemana[date]);
tr_destaque.setAttribute('class', 'destaque');

