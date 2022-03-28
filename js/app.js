
let catalog = document.getElementsByClassName("catalog")[0];
let filter_name = document.getElementById("filter-name");
let filter_brand = document.getElementById("filter-brand");
let filter_type = document.getElementById("filter-type");
let filter_order = document.getElementById("sort-type");
let lista = undefined;

fetch("http://makeup-api.herokuapp.com/api/v1/products.json")
  .then((response) => response.json().then(printProducts))
  .catch(error => catalog.innerHTML = "Erro ao carregar informações");


function printProducts(productsFromApi) {
  lista = productsFromApi;
  imprimir();
}

function imprimir() {
  if (lista) {
    listaFiltrada = lista;
    catalog.innerHTML = "";
    if (filter_name?.value != ''){
      listaFiltrada = lista.filter(prd => prd.name.includes(filter_name.value));
    }
    for (let product of listaFiltrada) {
      catalog.appendChild(productItem(product))
    }
  }
}

//EXEMPLO DO CÓDIGO PARA UM PRODUTO
function productItem(product) {
  var div = document.createElement('div');
  div.classList.add("product")
  div.dataset.name = product.name;
  div.dataset.brand = product.brand;
  div.dataset.type = product.product_type;
  div.tabIndex = product.id;
  div.innerHTML = `
  <figure class="product-figure">
    <img src="http:${product.api_featured_image}" width="215" height="215" alt="${product.name}" onerror="javascript:this.src='img/unavailable.png'">
  </figure>
  <section class="product-description">
    <h1 class="product-name">${product.name}</h1>
    <div class="product-brands"><span class="product-brand background-brand">${product.brand}</span>
<span class="product-brand background-price">R$ ${(parseFloat(product.price) * 5.5).toFixed(2)}</span></div>
  </section>
  ${loadDetails(product)}
  `;
  return div;
}

//EXEMPLO DO CÓDIGO PARA OS DETALHES DE UM PRODUTO
function loadDetails(product) {
  let details = `<section class="product-details"><div class="details-row">
        <div>Brand</div>
        <div class="details-bar">
          <div class="details-bar-bg" style="width= 250">${product.brand}</div>
        </div>
      </div><div class="details-row">
        <div>Price</div>
        <div class="details-bar">
          <div class="details-bar-bg" style="width= 250">R$ ${(parseFloat(product.price) * 5.5).toFixed(2)}</div>
        </div>
      </div><div class="details-row">
        <div>Rating</div>
        <div class="details-bar">
          <div class="details-bar-bg" style="width= 250">${product.rating ?? "No Information"}</div>
        </div>
      </div><div class="details-row">
        <div>Category</div>
        <div class="details-bar">
          <div class="details-bar-bg" style="width= 250">${product.category}</div>
        </div>
      </div><div class="details-row">
        <div>Product_type</div>
        <div class="details-bar">
          <div class="details-bar-bg" style="width= 250">${product.product_type}</div>
        </div>
      </div></section>`;
  return details;
}
