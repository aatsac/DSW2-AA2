import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

const API_URL = 'http://localhost:5000'

export default function Cliente() {
  const [user, setUser] = useState(null)
  const [carros, setCarros] = useState([])
  const [busca, setBusca] = useState('')
  const [loading, setLoading] = useState(true)
  const [mensagem, setMensagem] = useState('')
  const [modalAberto, setModalAberto] = useState(false)
  const [carroSelecionado, setCarroSelecionado] = useState(null)
  const navigate = useNavigate()

  const ano = new Date().getFullYear()

  // Guard: só cliente logado acessa
  useEffect(() => {
    const stored = localStorage.getItem('automarketUser')
    if (!stored) {
      navigate('/login')
      return
    }
    const parsed = JSON.parse(stored)
    if (parsed.tipo !== 'cliente') {
      navigate('/login')
      return
    }
    setUser(parsed)
  }, [navigate])

  // Carregar carros
  useEffect(() => {
    async function carregarCarros() {
      try {
        const res = await axios.get(`${API_URL}/carros`)
        setCarros(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    carregarCarros()
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

  const handleProposta = async (carro) => {
    if (!user) return
    setMensagem('')

    try {
      // primeiro verifica se já existe proposta desse cliente pra esse carro
      const resExistente = await axios.get(`${API_URL}/propostas`, {
        params: {
          clienteId: user.id,
          carroId: carro.id,
        },
      })

      if (resExistente.data.length > 0) {
        setMensagem('Você já enviou uma proposta para este veículo.')
        return
      }

      // se não existir, cria uma nova
      await axios.post(`${API_URL}/propostas`, {
        clienteId: user.id,
        carroId: carro.id,
        valor: carro.preco,
        status: 'pendente',
      })

      setMensagem('Proposta enviada com sucesso!')
    } catch (err) {
      console.error(err)
      setMensagem('Erro ao enviar proposta. Tente novamente.')
    }
  }

  if (!user) return null

  return (
    <>
      {/* Conteúdo principal */}
      <main className="container main">
        {/* Busca + cabeçalho */}
        <section className="search" aria-labelledby="titulo-busca">
          <h1 id="titulo-busca" className="sr-only">
            Buscar veículos
          </h1>

          <div
            className="search__header"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              marginBottom: '0.75rem',
            }}
          >
            <p className="auth__subtitle" style={{ margin: 0 }}>
              Olá, <strong>{user.nome}</strong>. Encontre seu próximo carro ou
              acompanhe suas propostas.
            </p>
            <div>
              <Link to="/propostas" className="btn btn--ghost">
                Minhas propostas
              </Link>
            </div>
          </div>

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
              className="btn btn--primary search__btn"
              type="submit"
              aria-label="Buscar"
            >
              Buscar
            </button>
          </form>
        </section>

        {mensagem && (
          <section>
            <p className="auth__hint" style={{ marginTop: '0.5rem' }}>
              {mensagem}
            </p>
          </section>
        )}

        {/* Lista de veículos */}
        <section className="catalogo" aria-labelledby="titulo-catalogo">
          <h2 id="titulo-catalogo" className="sr-only">
            Veículos disponíveis
          </h2>

          {loading && <p>Carregando veículos...</p>}

          {!loading && (
            <>
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
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            className="btn btn--ghost js-open-details"
                            onClick={() => abrirModal(carro)}
                          >
                            Detalhes
                          </button>
                          <button
                            type="button"
                            className="btn btn--primary"
                            onClick={() => handleProposta(carro)}
                          >
                            Fazer proposta
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {carrosFiltrados.length === 0 && (
                <p style={{ marginTop: '1rem' }}>
                  Nenhum veículo encontrado para essa busca.
                </p>
              )}
            </>
          )}
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
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => handleProposta(carroSelecionado)}
                >
                  Fazer proposta
                </button>
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
