const APICART = 'http://localhost:8000/cart';


async function renderCart() {
    let res = await fetch(`${APICART}`)
    let data = await res.json()
    $('.cart-container').html('')
    data.forEach(item => {
        $('.cart-container').append(`
      <div class="cart-item cart-column">
      <img src="./img/product/Suzuki 1.jpg" alt="" width="200px" height="auto">
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-name">${item.model}</span>
        <span class="cart-item-name">${item.price}</span>
        <img id=${item.id} src="./img/icon/trash.svg" alt="" width="25px" height="auto">
      </div>
        `)
        
    });
    
}


//Получаем id по клику на кнопку удаления контакта
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