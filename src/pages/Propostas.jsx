import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

const API_URL = 'http://localhost:5000'

export default function Propostas() {
  const [user, setUser] = useState(null)
  const [propostas, setPropostas] = useState([])
  const [carros, setCarros] = useState([])
  const [loading, setLoading] = useState(true)
  const [mensagem, setMensagem] = useState('')
  const navigate = useNavigate()

  const ano = new Date().getFullYear()

  // Guard: permite cliente E loja
  useEffect(() => {
    const stored = localStorage.getItem('automarketUser')
    if (!stored) {
      navigate('/login')
      return
    }
    const parsed = JSON.parse(stored)
    if (parsed.tipo !== 'cliente' && parsed.tipo !== 'loja') {
      navigate('/login')
      return
    }
    setUser(parsed)
  }, [navigate])

  useEffect(() => {
    async function carregarDados() {
      try {
        const [resPropostas, resCarros] = await Promise.all([
          axios.get(`${API_URL}/propostas`),
          axios.get(`${API_URL}/carros`),
        ])
        setPropostas(resPropostas.data)
        setCarros(resCarros.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    carregarDados()
  }, [])

  if (!user) return null

  const getCarro = (id) => carros.find((c) => c.id === id)

  // Propostas visíveis:
  // - cliente: só as dele
  // - loja: só propostas de carros da loja
  let propostasVisiveis = []
  if (user.tipo === 'cliente') {
    propostasVisiveis = propostas.filter((p) => p.clienteId === user.id)
  } else if (user.tipo === 'loja') {
    propostasVisiveis = propostas.filter((p) => {
      const carro = getCarro(p.carroId)
      return carro && carro.lojaId === user.id
    })
  }

  const handleCancelar = async (id) => {
    setMensagem('')
    try {
      await axios.delete(`${API_URL}/propostas/${id}`)
      setPropostas((prev) => prev.filter((p) => p.id !== id))
      setMensagem('Proposta cancelada com sucesso.')
    } catch (err) {
      console.error(err)
      setMensagem('Erro ao cancelar proposta. Tente novamente.')
    }
  }

  const handleAtualizarStatus = async (id, novoStatus) => {
    setMensagem('')
    try {
      // Atualiza apenas o status da proposta
      await axios.patch(`${API_URL}/propostas/${id}`, { status: novoStatus })

      setPropostas((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                status: novoStatus,
              }
            : p,
        ),
      )

      setMensagem(
        novoStatus === 'aceita'
          ? 'Proposta aceita com sucesso.'
          : 'Proposta rejeitada com sucesso.',
      )
    } catch (err) {
      console.error(err)
      setMensagem('Erro ao atualizar proposta. Tente novamente.')
    }
  }

  const titulo =
    user.tipo === 'cliente' ? 'Minhas propostas' : 'Propostas recebidas'

  const subtitulo =
    user.tipo === 'cliente'
      ? 'Acompanhe o status das suas ofertas.'
      : 'Gerencie as propostas recebidas para os veículos da loja.'

  const textoSemPropostas =
    user.tipo === 'cliente'
      ? 'Você ainda não enviou nenhuma proposta.'
      : 'Ainda não há propostas cadastradas para os seus veículos.'

  return (
    <>
      <main className="container main">
        <section className="hero">
          <h1 className="hero__title">{titulo}</h1>
          <p className="hero__subtitle">{subtitulo}</p>
        </section>

        {mensagem && (
          <section>
            <p className="auth__hint" style={{ marginBottom: '1rem' }}>
              {mensagem}
            </p>
          </section>
        )}

        <section>
          {loading && <p>Carregando...</p>}
          {!loading && propostasVisiveis.length === 0 && (
            <p>{textoSemPropostas}</p>
          )}
          {!loading && propostasVisiveis.length > 0 && (
            <div className="grid">
              {propostasVisiveis.map((p) => {
                const carro = getCarro(p.carroId)
                const podeCancelar =
                  user.tipo === 'cliente' &&
                  (p.status === 'pendente' || !p.status)

                const podeGerenciarLoja =
                  user.tipo === 'loja' &&
                  (p.status === 'pendente' || !p.status) &&
                  carro &&
                  carro.lojaId === user.id

                return (
                  <article key={p.id} className="card">
                    <div className="card__body">
                      <h3 className="card__title">
                        {carro ? carro.nome : 'Veículo'}
                      </h3>

                      <p className="card__meta">
                        Valor oferecido:{' '}
                        {p.valor.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </p>

                      <p className="card__meta">
                        Status:{' '}
                        <strong>
                          {p.status
                            ? p.status.charAt(0).toUpperCase() +
                              p.status.slice(1)
                            : 'pendente'}
                        </strong>
                      </p>

                      {/* Ações do cliente */}
                      {podeCancelar && (
                        <div style={{ marginTop: '0.75rem' }}>
                          <button
                            type="button"
                            className="btn btn--ghost"
                            onClick={() => handleCancelar(p.id)}
                          >
                            Cancelar proposta
                          </button>
                        </div>
                      )}

                      {/* Ações da loja */}
                      {podeGerenciarLoja && (
                        <div
                          style={{
                            marginTop: '0.75rem',
                            display: 'flex',
                            gap: '0.5rem',
                            flexWrap: 'wrap',
                          }}
                        >
                          <button
                            type="button"
                            className="btn btn--primary"
                            onClick={() => handleAtualizarStatus(p.id, 'aceita')}
                          >
                            Aceitar
                          </button>
                          <button
                            type="button"
                            className="btn btn--ghost"
                            onClick={() =>
                              handleAtualizarStatus(p.id, 'rejeitada')
                            }
                          >
                            Rejeitar
                          </button>
                        </div>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>

        {/* Botão Voltar embaixo das propostas */}
        <section style={{ marginTop: '1.5rem' }}>
          {user.tipo === 'cliente' && (
            <Link to="/cliente" className="btn btn--primary">
              Voltar
            </Link>
          )}
          {user.tipo === 'loja' && (
            <Link to="/loja" className="btn btn--primary">
              Voltar
            </Link>
          )}
        </section>
      </main>

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
