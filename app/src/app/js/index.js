const input = document.querySelector('#inputValue');
const button = document.querySelector('#btn');

button.addEventListener("click", async (e) => {
  const url = 'https://padaria-server.vercel.app/sale/newSale';
  e.preventDefault();
  const date = new Date();
  const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
  const day = date.toLocaleDateString('pt-BR')

  await fetch(url, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ value: input.value, date: { time, day } })
  })
    .then(req => {
      console.log(req);
      return req.json();
    })
    .catch(error => {
      console.error('Erro:', error);
    });

  requestAnimationFrame(() => {
    input.value = '';
  });
});
