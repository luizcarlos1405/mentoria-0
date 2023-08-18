let button = document.querySelector('button[name = button-send]');
let inputContent = document.querySelector('input[name = content]');

button.addEventListener('click',()=>{setTimeout(() => {
  inputContent.value = " ";
}, 700)});
