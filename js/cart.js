const APICART = 'http://localhost:8000/cart';

async function renderCart() {
    let res = await fetch(`${APICART}`)
    let data = await res.json()
    let price = [];
    data.map(item => {
        price.push(item.price)
    })
    price = price.map(Number)
    let totalSum = 0;
    price.map(item => {
        totalSum += item
    })
    $('.cart-container').html('')
    data.forEach(item => {
        $('.cart-container').append(`
      <div class="cart-column">
      <img src="${item.img}" alt="" width="200px" height="120px">
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-name">${item.model}</span>
        <span class="cart-item-name">${item.price} $</span>
        <img class="cart__delete" id=${item.id} src="./img/icon/trash.svg" alt="" width="25px" height="auto">
      </div>
      `)
    });
    $('.cart-container').append(`
    <div class="total__price">
        <span>Общая сумма заказа: ${totalSum} $</span>
    </div>    
    `)
    if(totalSum === 0) {
        $('.cart-container').append(`<div class="empty__cart"><span>К сожалению корзина пуста(</span></div>`);
        $('.total__price').css('visibility', 'hidden');
    }else {
        $('.empty__cart').css('visibility', 'hidden');
        $('.total__price').css('visibility', 'visible');
    }
}

//Получаем id по клику на кнопку удаления товара
$('body').on('click', '.cart-column', function (event) {
    console.log(event.target)
    const itemIdDel = event.target.id;
    deleteCart(itemIdDel)
})

//Удаляем данные из базы
function deleteCart(delData) {
    fetch(`${APICART}/${delData}`, {
        method: 'DELETE'
    })
        .then(() => renderCart())
}

renderCart()


// let data = {price: "5000"};

// let newdata = [];

// newdata.push(data.price)

// console.log(newdata)