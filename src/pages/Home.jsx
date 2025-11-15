import { useEffect, useState } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:5000'

export default function Home() {
  const [carros, setCarros] = useState([])
  const [busca, setBusca] = useState('')
  const [modalAberto, setModalAberto] = useState(false)
  const [carroSelecionado, setCarroSelecionado] = useState(null)

  useEffect(() => {
    axios.get(`${API_URL}/carros`).then((res) => setCarros(res.data))
  }, [])

  const carrosFiltrados = carros.filter((c) => {
    const termo = busca.toLowerCase()
    return (
      c.nome.toLowerCase().includes(termo) ||
      c.descricao.toLowerCase().includes(termo)
    )
  })

  const abrirModal = (carro) => {
    setCarroSelecionado(carro)
    setModalAberto(true)
  }

  const fecharModal = () => {
    setModalAberto(false)
    setCarroSelecionado(null)
  }

  const ano = new Date().getFullYear()

  return (
    <>
      {/* Conteúdo principal */}
      <main className="container main">
        {/* Busca */}
        <section className="search">
          <form
            className="search__form"
            role="search"
            aria-label="Buscar veículos"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              className="search__input"
              type="search"
              name="q"
              placeholder="Busque por marca, modelo, ano..."
              aria-label="Pesquisar veículos"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            <button
              className="btn search__btn"
              type="submit"
              aria-label="Buscar"
            >
              <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 5 1.5-1.5-5-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z" />
              </svg>
              Buscar
            </button>
          </form>
        </section>

        {/* Lista de veículos */}
        <section className="catalogo" aria-labelledby="titulo-catalogo">
          <h2 id="titulo-catalogo" className="sr-only">
            Veículos em destaque
          </h2>

          <div className="grid">
            {carrosFiltrados.map((carro) => (
              <article key={carro.id} className="card">
                <button
                  type="button"
                  className="card__media js-open-details"
                  aria-label={`Ver detalhes de ${carro.nome}`}
                  onClick={() => abrirModal(carro)}
                >
                  <img src={carro.imagem} alt={carro.nome} />
                </button>
                <div className="card__body">
                  <h3 className="card__title">{carro.nome}</h3>
                  <p className="card__meta">
                    {carro.km.toLocaleString('pt-BR')} km • {carro.cambio} •{' '}
                    {carro.combustivel}
                  </p>
                  <div className="card__footer">
                    <span className="price">
                      {carro.preco.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </span>
                    <button
                      type="button"
                      className="btn btn--primary js-open-details"
                      onClick={() => abrirModal(carro)}
                    >
                      Ver detalhes
                    </button>
                  </div>
                </div>
              </article>
            ))}
            {carrosFiltrados.length === 0 && (
              <p>Nenhum veículo encontrado para essa busca.</p>
            )}
          </div>
        </section>
      </main>

      {/* Modal de Detalhes */}
      {carroSelecionado && (
        <>
          <div
            className={`modal-backdrop ${modalAberto ? 'is-open' : ''}`}
            aria-hidden={modalAberto ? 'false' : 'true'}
            onClick={fecharModal}
          />
          <div
            className={`modal ${modalAberto ? 'is-open' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-hidden={modalAberto ? 'false' : 'true'}
            aria-labelledby="detailTitle"
          >
            <button
              className="modal__close btn btn--ghost"
              type="button"
              aria-label="Fechar detalhes"
              onClick={fecharModal}
            >
              ×
            </button>

            <div className="modal__media">
              <img
                id="detailImg"
                src={carroSelecionado.imagem}
                alt={carroSelecionado.nome}
              />
            </div>

            <div className="modal__body">
              <h3 id="detailTitle" className="modal__title">
                {carroSelecionado.nome}
              </h3>
              <p id="detailMeta" className="modal__meta">
                {carroSelecionado.km.toLocaleString('pt-BR')} km •{' '}
                {carroSelecionado.cambio} • {carroSelecionado.combustivel}
              </p>

              <div className="modal__row">
                <span id="detailPrice" className="price">
                  {carroSelecionado.preco.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </span>
              </div>

              <p id="detailDesc" className="modal__desc">
                {carroSelecionado.descricao || 'Veículo em excelente estado.'}
              </p>
            </div>
          </div>
        </>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="container footer__inner">
          <p>
            © <span>{ano}</span> AutoMarket — Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </>
  )
}
