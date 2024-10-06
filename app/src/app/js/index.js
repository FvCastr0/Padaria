const input = document.querySelector('#inputValue');
const button = document.querySelector('#btn');

button.addEventListener("click", async (e) => {
  const url = 'https://padaria-server.vercel.app/sale/newSale';
  e.preventDefault();

  await fetch(url, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ value: input.value, date: new Date() })
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
