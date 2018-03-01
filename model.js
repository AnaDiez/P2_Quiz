const fs = require("fs");

// Fichero donde se guardan las preguntas.
const DB_FILENAME = "quizzes.json";


// Variable con todas las preguntas.
let quizzes = [
  {
  	question: "Capital de España",
  	answer:"Madrid"
  },
  {
  	question: "8+2",
  	answer:"10"
  },
  {
  	question: "Autor Quijote",
  	answer:"Cervantes"
  },
  {
  	question: "Simbolo  químico del agua",
  	answer:"H20"
  }
];

// Método: cargar las preguntas en el fichero al arrancar el programa
const load = () =>{
	fs.readFile(DB_FILENAME, (err,data) =>{
       if(err){
       	if(err.code === "ENOENT"){
       		save();
       		return;
       	 }
       	 throw err;
       	}
       	let json = JSON.parse(data);
       	if(json){
       		quizzes=json;
       	}
	});
};

// Método : guarda las preguntas en el fichero
const save = () =>{
	fs.writeFile(
		DB_FILENAME,
		JSON.stringify(quizzes),
		err => {
			if (err) throw err;
		});
};
// Método: Número de preguntas del quiz
exports.count = () => quizzes.length;

// Método: añade nueva pregunta
exports.add = (question,answer)=>{
	quizzes.push({
		question: (question || "").trim(),
		answer: (answer || "").trim()
	});
	save();
};

//Método: Actualiza la pregunta de la posicion index.
exports.update =(id,question,answer) =>{
	const quiz = quizzes[id];
	if (typeof quiz ==="undefined"){
		throw new Error(`El valor del parametro id no es válido.`);
	}
	quizzes.splice(id, 1,{
		question: (question || "").trim(),
		answer: (answer || "").trim()}
		);
	save();
}; 

//Método: Nos muestra todas las preguntas existentes.
exports.getAll = () => JSON.parse(JSON.stringify(quizzes));

//Método: Saca la pregunta identificada por index.
exports.getByIndex = (id) =>{
	const quiz = quizzes[id];
	if (typeof quiz ==="undefined"){
		throw new Error(`El valor del parametro id no es válido.`);
	}
	return JSON.parse(JSON.stringify(quiz));
};

// Método: elimina la pregunta de la posicion dada.
exports.deleteByIndex = (id) =>{
	const quiz = quizzes[id];
	if (typeof quiz ==="undefined"){
		throw new Error(`El valor del parametro id no es válido.`);
	}
	quizzes.splice(id,1);
	save();
};

// carga las preguntas
load();
 