import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

const API_URL = 'http://localhost:5000'

export default function Loja() {
  const [user, setUser] = useState(null)
  const [carros, setCarros] = useState([])
  const [loadingCarros, setLoadingCarros] = useState(true)
  const navigate = useNavigate()
  const ano = new Date().getFullYear()

  // Guard: só loja
  useEffect(() => {
    const stored = localStorage.getItem('automarketUser')
    if (!stored) {
      navigate('/login')
      return
    }
    const parsed = JSON.parse(stored)
    if (parsed.tipo !== 'loja') {
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
        setLoadingCarros(false)
      }
    }
    carregarCarros()
  }, [])

  if (!user) return null

  // AGORA: só carros com lojaId === user.id
  const carrosDaLoja = carros.filter((c) => c.lojaId === user.id)

  return (
    <>
      <main className="container main">
        {/* Cabeçalho da loja */}
        <section className="hero">
          <h1 className="hero__title">Veículos da loja</h1>
          <p className="hero__subtitle">
            Loja: <strong>{user.nome}</strong>. Gerencie seus veículos e
            propostas.
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              marginTop: '0.5rem',
            }}
          >
            <Link to="/propostas" className="btn btn--ghost">
              Ver propostas
            </Link>
            <Link to="/loja/cadastrar" className="btn btn--primary">
              Cadastrar novo veículo
            </Link>
          </div>
        </section>

        {/* Lista de veículos da loja */}
        <section className="catalogo" aria-labelledby="titulo-carros-loja">
          <h2 id="titulo-carros-loja" className="sr-only">
            Veículos cadastrados pela loja
          </h2>

          {loadingCarros && <p>Carregando veículos...</p>}

          {!loadingCarros && carrosDaLoja.length === 0 && (
            <p>Nenhum veículo cadastrado ainda.</p>
          )}

          {!loadingCarros && carrosDaLoja.length > 0 && (
            <div className="grid">
              {carrosDaLoja.map((carro) => (
                <article key={carro.id} className="card">
                  <div className="card__media" aria-hidden="true">
                    <img src={carro.imagem} alt={carro.nome} />
                  </div>
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
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

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
