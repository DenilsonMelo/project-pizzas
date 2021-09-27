let cart = [];
let quantidadeModal = 1;
let modalKey = 0;

const selector = (element) => document.querySelector(element);
const selectorAll = (element) => document.querySelectorAll(element);

pizzaJson.map((item, index) => {
    let pizzaItem = selector('.models .pizza-item').cloneNode(true);

    pizzaItem.setAttribute('data-key', index);

    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    // Listagem das pizzas
    pizzaItem.querySelector('a').addEventListener('click', (event) => {
        event.preventDefault();

        //Closest encontra o elemento com a classe mais próxima
        let key = event.target.closest('.pizza-item').getAttribute('data-key');
        
        quantidadeModal = 1;
        modalKey = key;
        
        selector('.pizzaBig img').src = pizzaJson[key].img;
        selector('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        selector('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        selector('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        selector('.pizzaInfo--size.selected').classList.remove('selected');

        selectorAll('.pizzaInfo--size').forEach((size, index) => {
            if(index === 2) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[index];
        });

        selector('.pizzaInfo--qt').innerHTML = quantidadeModal;

        selector('.pizzaWindowArea').style.opacity = 0;
        selector('.pizzaWindowArea').style.display = 'flex';

        //Modal Animation
        setTimeout(() => {
            selector('.pizzaWindowArea').style.opacity = 1;
        }, 200);
    })

    selector('.pizza-area').append(pizzaItem);
});

// ---- Eventos do Modal ----
function closeModal(){
    selector('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        selector('.pizzaWindowArea').style.display = 'none';
    }, 500);    
}
// Fechar o Modal
selectorAll('.pizzaInfo--cancelMobileButton, .pizzaInfo--cancelButton').forEach((item) => {
    item.addEventListener('click', closeModal);
});
// Diminuir a quantidade
selector('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if(quantidadeModal > 1){
        quantidadeModal--;
        selector('.pizzaInfo--qt').innerHTML = quantidadeModal;
    }
});
// Aumentar a quantidade
selector('.pizzaInfo--qtmais').addEventListener('click', () => {
    quantidadeModal++;
    selector('.pizzaInfo--qt').innerHTML = quantidadeModal;
});
// Selecionar o tamanho da Pizza
selectorAll('.pizzaInfo--size').forEach((size, index) => {
    size.addEventListener('click', (event) => {
        selector('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected')
    });
});
// Adicionar pizzas no carrinho
selector('.pizzaInfo--addButton').addEventListener('click', () => {
    let size = parseInt(selector('.pizzaInfo--size.selected').getAttribute('data-key'));

    cart.push({
        id: pizzaJson[modalKey].id,
        size,
        amount: quantidadeModal,
    });

    closeModal();
});