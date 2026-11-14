const produtos = [
    { id: 1, nome: "Smartphone Galaxy A54", categoria: "Smartphones", imagem: "imagens/1-galaxy-a54.jpeg", preco: 16000 },
    { id: 2, nome: "iPhone 13 (Recondicionado)", categoria: "Smartphones", imagem: "imagens/2-iphone-13.jpeg", preco: 19000 },
    { id: 3, nome: "Smartphone Redmi Note 12", categoria: "Smartphones", imagem: "imagens/3-redmi-note-12.jpeg", preco: 12800 },
    { id: 4, nome: "Laptop HP Pavilion 15", categoria: "Computadores", imagem: "imagens/4-hp-pavilion-15.jpeg", preco: 32000 },
    { id: 5, nome: "Laptop Lenovo IdeaPad 3", categoria: "Computadores", imagem: "imagens/5-lenovo-ideapad-3.jpeg", preco: 22500 },
    { id: 6, nome: "Teclado e Rato Logitech", categoria: "Acessórios", imagem: "imagens/6-teclado-rato-logitech.jpg", preco: 1500 },
    { id: 7, nome: "Fones Bluetooth JBL Tune", categoria: "Áudio", imagem: "imagens/7-fones-jbl-tune.png", preco: 2500 },
    { id: 8, nome: "Coluna Bluetooth JBL Flip 6", categoria: "Áudio", imagem: "imagens/8-coluna-jbl-flip-6..jpg", preco: 6700 },
    { id: 9, nome: "Smart TV LG 43\" 4K", categoria: "TVs", imagem: "imagens/9-tv-lg-43..png", preco: 14000 },
    { id: 10, nome: "Smart TV Samsung 32\"", categoria: "TVs", imagem: "imagens/10-tv-samsung-32.png", preco: 8500 },
    { id: 11, nome: "Smartwatch Mi Band 8", categoria: "Acessórios", imagem: "imagens/11-mi-band-8...jpg", preco: 1800 },
    { id: 12, nome: "Powerbank Anker 20000mAh", categoria: "Acessórios", imagem: "imagens/12-powerbank-anker.jpg", preco: 1000 }
  ];

  const categorias = ["Todos", "Smartphones", "Computadores", "Áudio", "TVs", "Acessórios"];

  let carrinho = [];
  let categoriaAtiva = "Todos";

  //FORMATAÇÃO DE PREÇO EM METICAIS
  function formatarPreco(valor) {
    return valor.toLocaleString("pt-MZ") + " MT";
  }

  //RENDERIZAR BOTÕES DE CATEGORIA
  function renderizarCategorias() {
    const container = document.getElementById("listaCategorias");
    container.innerHTML = categorias.map(cat => `
      <button class="cat-btn ${cat === categoriaAtiva ? 'ativo' : ''}" onclick="filtrarCategoria('${cat}')">
        ${cat}
      </button>
    `).join("");
  }

  function filtrarCategoria(cat) {
    categoriaAtiva = cat;
    renderizarCategorias();
    renderizarProdutos();
  }

  //RENDERIZAR GRELHA DE PRODUTOS
  function renderizarProdutos() {
    const lista = categoriaAtiva === "Todos"
      ? produtos
      : produtos.filter(p => p.categoria === categoriaAtiva);

    document.getElementById("contadorProdutos").textContent = `${lista.length} produtos`;

    const grid = document.getElementById("gridProdutos");
    grid.innerHTML = lista.map(p => `
      <div class="card-produto">
        <div class="card-imagem"><img src="${p.imagem}" alt="${p.nome}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 fill=%22%23e4eaf1%22/><text x=%2250%22 y=%2255%22 font-size=%2210%22 text-anchor=%22middle%22 fill=%22%235b6b7c%22>sem foto</text></svg>'"></div>
        <div class="card-corpo">
          <span class="card-categoria">${p.categoria}</span>
          <span class="card-nome">${p.nome}</span>
          <span class="card-preco">${formatarPreco(p.preco)} <small>à vista</small></span>
          <button class="btn-adicionar" id="btn-${p.id}" onclick="adicionarAoCarrinho(${p.id})">
            Adicionar ao carrinho
          </button>
        </div>
      </div>
    `).join("");
  }

  //LÓGICA DO CARRINHO
  function adicionarAoCarrinho(id) {
    const item = carrinho.find(i => i.id === id);
    if (item) {
      item.quantidade++;
    } else {
      carrinho.push({ id, quantidade: 1 });
    }
    atualizarContadorCarrinho();
    renderizarCarrinho();

    const btn = document.getElementById(`btn-${id}`);
    const textoOriginal = btn.textContent;
    btn.textContent = "Adicionado ✓";
    btn.classList.add("ok");
    setTimeout(() => {
      btn.textContent = textoOriginal;
      btn.classList.remove("ok");
    }, 1200);
  }

  function alterarQuantidade(id, delta) {
    const item = carrinho.find(i => i.id === id);
    if (!item) return;
    item.quantidade += delta;
    if (item.quantidade <= 0) {
      carrinho = carrinho.filter(i => i.id !== id);
    }
    atualizarContadorCarrinho();
    renderizarCarrinho();
  }

  function removerDoCarrinho(id) {
    carrinho = carrinho.filter(i => i.id !== id);
    atualizarContadorCarrinho();
    renderizarCarrinho();
  }

  function totalCarrinho() {
    return carrinho.reduce((soma, item) => {
      const produto = produtos.find(p => p.id === item.id);
      return soma + produto.preco * item.quantidade;
    }, 0);
  }

  function atualizarContadorCarrinho() {
    const totalItens = carrinho.reduce((soma, i) => soma + i.quantidade, 0);
    document.getElementById("contadorCarrinho").textContent = totalItens;
  }

  function renderizarCarrinho() {
    const lista = document.getElementById("carrinhoLista");
    const btnFinalizar = document.getElementById("btnFinalizar");

    if (carrinho.length === 0) {
      lista.innerHTML = `<div class="carrinho-vazio">O teu carrinho está vazio.<br>Adiciona produtos para continuar.</div>`;
      btnFinalizar.disabled = true;
    } else {
      lista.innerHTML = carrinho.map(item => {
        const produto = produtos.find(p => p.id === item.id);
        return `
          <div class="item-carrinho">
            <div class="item-icone"><img src="${produto.imagem}" alt="${produto.nome}" onerror="this.style.display='none'"></div>
            <div class="item-info">
              <div class="nome">${produto.nome}</div>
              <div class="preco-unit">${formatarPreco(produto.preco)}</div>
              <div class="item-qtd">
                <button class="qtd-btn" onclick="alterarQuantidade(${produto.id}, -1)">−</button>
                <span>${item.quantidade}</span>
                <button class="qtd-btn" onclick="alterarQuantidade(${produto.id}, 1)">+</button>
              </div>
              <div class="remover-btn" onclick="removerDoCarrinho(${produto.id})">Remover</div>
            </div>
          </div>
        `;
      }).join("");
      btnFinalizar.disabled = false;
    }

    document.getElementById("carrinhoTotal").textContent = formatarPreco(totalCarrinho());
  }

  //ABERTURA /FECHAMENTO PAINEL DO CARRINHO
  function abrirCarrinho() {
    document.getElementById("painelCarrinho").classList.add("aberto");
    document.getElementById("overlay").classList.add("aberto");
  }

  function fecharCarrinho() {
    document.getElementById("painelCarrinho").classList.remove("aberto");
    document.getElementById("overlay").classList.remove("aberto");
  }

  function fecharTudo() {
    fecharCarrinho();
    fecharModal();
  }

  function abrirCheckout() {
    if (carrinho.length === 0) return;
    const modal = document.getElementById("modalCheckout");
    const conteudo = document.getElementById("conteudoModal");

    conteudo.innerHTML = `
      <h3>Finalizar compra</h3>
      <p class="sub">Preenche os teus dados para concluirmos a encomenda.</p>
      <div class="resumo-total">
        <span>Total a pagar</span>
        <span>${formatarPreco(totalCarrinho())}</span>
      </div>
      <form id="formCheckout" onsubmit="confirmarEncomenda(event)">
        <input type="text" placeholder="Nome completo" required>
        <input type="tel" placeholder="Número de telefone" required>
        <input type="text" placeholder="Endereço de entrega (bairro, referência)" required>
        <button type="submit" class="btn-finalizar">Confirmar encomenda</button>
      </form>
    `;
    modal.classList.add("aberto");
  }

  function confirmarEncomenda(evento) {
    evento.preventDefault();
    const conteudo = document.getElementById("conteudoModal");
    const numeroPedido = Math.floor(1000 + Math.random() * 9000);

    conteudo.innerHTML = `
      <div class="confirmacao">
        <div class="icone-ok">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <h3>Encomenda #${numeroPedido} confirmada!</h3>
        <p>Obrigado pela tua compra. A nossa equipa vai entrar em contacto para confirmar a entrega.</p>
        <button class="btn-fechar-modal" onclick="finalizarCompra()">Voltar à loja</button>
      </div>
    `;
  }

  function finalizarCompra() {
    carrinho = [];
    atualizarContadorCarrinho();
    renderizarCarrinho();
    fecharTudo();
  }

  function fecharModal() {
    document.getElementById("modalCheckout").classList.remove("aberto");
  }

  //FORMULÁRIO DE CONTACTO (SIMULADO)
  function enviarContacto(evento) {
    evento.preventDefault();
    alert("Mensagem enviada! Entraremos em contacto em breve.");
    evento.target.reset();
  }

  //INICIALIZAÇÃO
  renderizarCategorias();
  renderizarProdutos();

