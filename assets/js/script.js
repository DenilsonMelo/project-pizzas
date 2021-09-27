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

    let identifierPizza = pizzaJson[modalKey].id+'@'+size;

    let key = cart.findIndex((item) => item.identifierPizza === identifierPizza);

    if(key > -1){
        cart[key].amount += quantidadeModal;
    } else {
        cart.push({
            identifierPizza,
            id: pizzaJson[modalKey].id,
            size,
            amount: quantidadeModal,
        });
    }

    updateCart();
    closeModal();
});

selector('.menu-openner').addEventListener('click', () => {
    if(cart.length > 0){
        selector('aside').style.left = '0';
    }
});

selector('.menu-closer').addEventListener('click', () => {
    selector('aside').style.left = '100vw';
})

function updateCart(){
    selector('.menu-openner span').innerHTML = cart.length;


    if(cart.length > 0){
        selector('aside').classList.add('show');
        selector('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart){
            let pizzaItem = pizzaJson.find((item) => item.id === cart[i].id)

            subtotal += pizzaItem.price * cart[i].amount;

            let cartItem = selector('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }
            
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].amount;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if(cart[i].amount > 1){
                    cart[i].amount--;
                } else{
                    cart.splice(i, 1)
                }

                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].amount++;
                updateCart();
            });

            selector('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        selector('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        selector('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        selector('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else{
        selector('aside').classList.remove('show');
        selector('aside').style.left = '100vw';
    }
}