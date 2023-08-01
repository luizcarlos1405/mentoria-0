console.log("Oi")

function limparTexto(){
  setTimeout(()=>{
      let caixaTexto = document.querySelector('input[name = message]');

    caixaTexto.value = " ";
    },700);
};