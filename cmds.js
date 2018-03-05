const model = require('./model');



const {log, biglog, errorlog, colorize} = require('./out');

exports.helpCmp = rl => {
      log('Comandos:');
      log('  h/help: Muestra ayuda.');
      log('  list: Lista los quizzes existentes.');
      log('  show <id>: Muestra la pregunta y la respuesta del quiz indicado');
      log('  add: Añade un nuevo quiz');
      log('  delete <id>: Borra el quiz indicado.');
      log('  test <id>: Probar el quiz indicado.');
      log('  p/play: Jugar aleatoriamente con todas las preguntas.');
      log('  credits: Créditos.');
      log('  q/quit: Salir del programa.');
      rl.prompt();
};
exports.quitCmd = rl =>{
     rl.close();
};

exports.addCmd = rl =>{
  rl.question(colorize('Introduzca una pregunta: ','red'), question =>{
    rl.question(colorize('Introduzca la respuesta: ','red'),answer =>{
      model.add(question,answer);
      log(`${colorize('Se ha añadido', 'magenta')}: ${question} ${colorize('=>', 'magenta')} ${answer}`);
      rl.prompt();
    });
  });    
};

exports.listCmd = rl =>{
     model.getAll().forEach((quiz,id)=>{
      log(`[${colorize(id, 'magenta')}]: ${quiz.question}`);
     });
     rl.prompt();
};

exports.showCmd = (rl,id) =>{
     
     if(typeof id ==="undefined"){
      errorlog (`Falta el parametro id.`);
     }else{
        try{
          const quiz = model.getByIndex(id);
          log(`[${colorize(id, 'magenta')}]: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
        } catch(error){
          errorlog(error.message);
        }

     }
     rl.prompt();
};

exports.testCmd = (rl,id) =>{
     if(typeof id ==="undefined"){
      errorlog (`Falta el parametro id.`);
      rl.prompt();
     }else{
        try{
          const quiz = model.getByIndex(id);
          const pregunta = quiz.question + "? ";
          rl.question(colorize(pregunta,'red'), respuesta =>{
            if(respuesta.toLowerCase().trim() === quiz.answer){
              // CORRECTO
              log("correct ");
              
              rl.prompt();
              
            }
            else{
              //INCORRECTO
              log("incorrect ");
              rl.prompt();
              
            }
          });
          
          } catch(error){
          errorlog(error.message);
          rl.prompt();
        }
     }
};

exports.playCmd = rl =>{
     let score = 0;
     var i;
     //array con todos los ids
     let toBeResolved =[];
     let num_preg = model.count();
     for(i = 0; i<num_preg; i++){
      toBeResolved[i] = i;
     }
     const playOne = () =>{
     if(toBeResolved.length === 0){
      //Mensaje final del play
      log("Fin");
      log(` No hay más preguntas`);
      log(` Examen finalizado con : ${score} puntos`);
      biglog(score, 'magenta');
      rl.prompt();
      } else{
      // Elegir una pregunta aleatoria
      let id = Math.round(Math.random()*(toBeResolved.length-1));

      // Hacer la pregunta
      let quiz = model.getByIndex(toBeResolved[id]);
      toBeResolved.splice(id,1);
      const pregunta = quiz.question + "? ";
      rl.question(colorize(quiz.question + '?','red'), respuesta =>{
                  if(respuesta.toLowerCase().trim() === quiz.answer){
                    // CORRECTO, CONTINUA
                    score ++;
                    
                    log(` correct `);
                    log(`Lleva  ${score}  aciertos`);
                    // HACER UNA NUEVA PREGUNTA
                    playOne();

                  }
                  else{
                    //INCORRECTO, FINAL
                    log("incorrect");
                    log("Fin ");
                    log ("Aciertos: ");
                    biglog(`${score}`, 'magenta');
                    rl.prompt();

                  }
                });
      }
    }
    playOne();
};

exports.deleteCmd = (rl,id) =>{
    if(typeof id ==="undefined"){
      errorlog (`Falta el parametro id.`);
     }else{
        try{
         model.deleteByIndex(id);     
        } catch(error){
          errorlog(error.message);
        }
     }
    rl.prompt();
};

exports.editCmd = (rl,id) =>{
    if(typeof id ==="undefined"){
      errorlog (`Falta el parametro id.`);
     }else{
        try{
          const quiz = model.getByIndex(id);
          process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)},0);
          rl.question(colorize('Introduzca una pregunta: ','red'), question =>{
            process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)},0);
            rl.question(colorize('Introduzca la respuesta: ','red'),answer =>{
              model.update(id, question, answer);
              log(`Se ha cambiado la pregunta ${colorize(id,'magenta')} por: ${question} ${colorize('=>', 'magenta')} ${answer}`);
              rl.prompt();
            });
          });
        } catch(error){
          errorlog(error.message);
          rl.prompt();
        }
     }
};

exports.creditsCmd = (rl)=>{
       log('Autor de la práctica:');
       log('ANA DIEZ');
       rl.prompt();
};

