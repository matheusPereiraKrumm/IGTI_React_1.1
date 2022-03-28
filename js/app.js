
let catalog = document.getElementsByClassName("catalog")[0];
let filter_name = document.getElementById("filter-name");
let filter_brand = document.getElementById("filter-brand");
let filter_type = document.getElementById("filter-type");
let filter_order = document.getElementById("sort-type");
let lista = undefined;
let timeout;

fetch("http://makeup-api.herokuapp.com/api/v1/products.json")
  .then((response) => response.json().then(printProducts))
  .catch(error => catalog.innerHTML = "Erro ao carregar informações");


function printProducts(productsFromApi) {
  lista = productsFromApi;
  carregarFiltros();
  imprimir();
}

function carregarFiltros() {
  let brands = lista.map(prd => prd.brand).filter((v, i, a) => a.indexOf(v) === i).sort();
  for (let brand of brands) {
    if (brand && brand != '') {
      var option = document.createElement('option');
      option.value = brand;
      option.innerHTML = brand;
      filter_brand.appendChild(option);
    }
  }

  let types = lista.map(prd => prd.product_type).filter((v, i, a) => a.indexOf(v) === i).sort();
  for (let type of types) {
    if (type && type != '') {
      var option = document.createElement('option');
      option.value = type;
      option.innerHTML = type;
      filter_type.appendChild(option);
    }
  }
}
filter_brand.addEventListener("change", imprimir);
filter_type.addEventListener("change", imprimir);
filter_order.addEventListener("change", imprimir);
filter_name.addEventListener("input", filterNameChange);
function filterNameChange() {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    imprimir();
  }, 500);
}

function imprimir() {
  if (lista) {
    console.log(new Date());
    listaFiltrada = lista;
    catalog.innerHTML = "";

    if (filter_name?.value != '') {
      listaFiltrada = listaFiltrada.filter(prd => prd.name.toUpperCase().includes(filter_name.value.toUpperCase()));
    }

    if (filter_brand?.value != '') {
      listaFiltrada = listaFiltrada.filter(prd => prd.brand?.includes(filter_brand.value) ?? false);
    }

    if (filter_type?.value != '') {
      listaFiltrada = listaFiltrada.filter(prd => prd.product_type?.includes(filter_type.value) ?? false);
    }

    listaFiltrada = listaFiltrada.sort((prd1, prd2) => {
      switch (filter_order.value) {
        case "Menores Preços":
          return parseFloat(prd1.price ?? 0) - parseFloat(prd2.price ?? 0);
        case "Maiores Preços":
          return parseFloat(prd2.price ?? 0) - parseFloat(prd1.price ?? 0);
        case "A-Z":
          return prd1.name.localeCompare(prd2.name);
        case "Z-A":
          return prd2.name.localeCompare(prd1.name);
        case "Melhor Avaliados":
        default:
          if (parseFloat(prd1.rating ?? 0) > parseFloat(prd2.rating ?? 0)) return -1;
          if (parseFloat(prd2.rating ?? 0) > parseFloat(prd1.rating ?? 0)) return 1;
          return 0;
      }
    });

    console.log(new Date());
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
