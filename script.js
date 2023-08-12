function limparTexto() {
  setTimeout(() => {
    let caixaTexto = document.querySelector("input[name = content]");

    caixaTexto.value = " ";
  }, 700);
}
