const API = 'http://localhost:8000/productList';
const APICART = 'http://localhost:8000/cart';

let itemIdEdit = null;
let pageCount = 1;
let page = 1;
let searchText = '';

//Получаем данные с полей ввода
$('.add__product').on('click', () => {
    if (!$('.input__name').val() && !$('.input__model').val() && !$('.input__store').val() && !$('.input__seller').val() && !$('.input__price').val()) {
        return alert('Заполните все поля')
    } else if (!$('.input__name').val() || !$('.input__model').val() || !$('.input__store').val() || !$('.input__seller').val() || !$('.input__price').val()) {
        return alert('Заполните все поля')
    }
    const newProduct = {
        name: $('.input__name').val(),
        model: $('.input__model').val(),
        store: $('.input__store').val(),
        seller: $('.input__seller').val(),
        price: $('.input__price').val()
    }
    addNewProduct(newProduct)
    $('.form-control').val('');
})

//Добавляем данные в базу
function addNewProduct(newItem) {
    fetch(`${API}`, {
        method: 'POST',
        body: JSON.stringify(newItem),
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    })
        .then(() => renderPage())
};

//Отображаем данные на странице
async function renderPage() {
    const result = await fetch(`${API}?_page=${page}&_limit=6&q=${searchText}`)
    const returnData = await result.json()
    addPagination()
    $('.product__list').html('');
    returnData.forEach(item => {
        $('.product__list').append(`<div id=${item.id} class="product__items" data-aos="flip-right" data-aos-duration="1000">
        <div class="product__img">
            <img src="./img/product/Suzuki 1.jpg" alt="" width="100%" height="auto">
        </div>
        <div class="product__description">
            <div class="product__name">${item.name}</div>
            <div class="product__model">Модель: ${item.model}</div>
            <div class="product__store">Кол-во: ${item.store}</div>
            <div class="product__seller">Продавец: ${item.seller}</div>
            <div class="product__price">Стоимость: ${item.price}</div>
        </div>
        <img id=${item.id} class="cart__icon"src="./img/icon/shopping-cart.svg" alt="" width="35px" height="auto">
        <div class="item__operation">
            <div id=${item.id} class="edit__item">Редактировать</div>
            <div id=${item.id} class="del__item">Удалить</div>
        </div>
    </div>
        `)
    })
}

//Получаем id по клику на кнопку удаления контакта
$('body').on('click', '.del__item', function (event) {
    console.log(event.target)
    const itemIdDel = event.target.id;
    deleteProduct(itemIdDel)
})

//Удаляем данные из базы
function deleteProduct(delData) {
    fetch(`${API}/${delData}`, {
        method: 'DELETE'
    })
        .then(() => renderPage())
}


//Получаем id по клику на кнопку редактирования контакта
$('body').on('click', '.edit__item', function (event) {
    itemIdEdit = event.target.id;
    $('.edit__modal').css('visibility', 'visible')
    editPersonData(itemIdEdit)
})

//Помещаем данные в поле для редактирования
async function editPersonData(editData) {
    const result = await fetch(`${API}/${editData}`)
    const returnData = await result.json()
    $('.edit__name').val(returnData.name);
    $('.edit__model').val(returnData.model);
    $('.edit__store').val(returnData.store);
    $('.edit__seller').val(returnData.seller);
    $('.edit__price').val(returnData.price);
}

//Отправляем обновленные данные в базу
$('.btn__save').on('click', () => {
    fetch(`${API}/${itemIdEdit}`, {
        method: 'PATCH',
        body: JSON.stringify({
            name: $('.edit__name').val(),
            model: $('.edit__model').val(),
            store: $('.edit__store').val(),
            seller: $('.edit__seller').val(),
            price: $('.edit__price').val()
        }),
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    })
    .then(() => renderPage())
    $('.edit__modal').css('visibility', 'hidden')
})

//Реализации пагинации
function addPagination() {
    fetch(`${API}?q=${searchText}`)
    .then(result => result.json())
    .then(data => {
        pageCount = Math.ceil(data.length / 6);
        $('.pagination-item').remove();
        for(let i = pageCount; i >= 1; i--){
            $('.previous__btn').after(`
            <li class="page-item pagination-item"><a class="page-link" href="#">${i}</a></li>
            `)
        }

    })
}

$('.next__btn').on('click', () => {
    if(page >= pageCount) return
    page++
    renderPage()
})

$('.previous__btn').on('click', () => {
    if(page <= 1) return
    page--
    renderPage()
})

$('body').on('click', '.pagination-item', (event) => {
    page = event.target.innerText;
    renderPage()
})

//Живой поиск
$('.form__search').on('input', (event) => {
    searchText = event.target.value;
    page = 1;
    renderPage()
})

//Корзина

$('body').on('click', '.cart__icon', function (event) {
    itemIdEdit = event.target.id;
    fetch(`${API}/${itemIdEdit}`)
        .then(res => res.json())
        .then(data =>{

            fetch(`${APICART}`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            })
        }) 
        
        
})

renderPage()


$('.slider').slick({
    dots: true,
    speed: 1000,
    easing: 'ease',
    autoplay: true,
    autoplaySpeed: 1000,
    pauseOnHover: true,
    fade: true,
    cssEase: 'linear'
});

