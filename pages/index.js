import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ProgressBar } from 'react-loader-spinner';
import ToastifyContainer from '../components/ToastContainer';

export default function Home() {
  const [terms, setTerms] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ terms: false, email: false });

  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasError = false;
    if (!terms) {
      setErrors((prev) => ({ ...prev, terms: true }));
      hasError = true;
    } else {
      setErrors((prev) => ({ ...prev, terms: false }));
    }
    if (!email) {
      setErrors((prev) => ({ ...prev, email: true }));
      hasError = true;
    } else {
      setErrors((prev) => ({ ...prev, email: false }));
    }

    if (hasError) {
      toast.error('Por favor, preencha os campos obrigatórios.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('https://apigo.onrender.com/search', {
        terms: terms.split(','),
        email: email,
      });
      if (response.status === 200) {
        toast.success(response.data.message);
        setTerms(''); // Limpa o campo de termos de busca após o envio
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Erro ao enviar o diagnóstico.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="container">
        <h1>Monitoramento de Marca</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="terms">Termos de Busca</label>
          <input
              type="text"
              id="terms"
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              placeholder="Digite os termos separados por vírgula"
              className={errors.terms ? 'error' : ''}
          />
          <label htmlFor="email">Email</label>
          <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email"
              className={errors.email ? 'error' : ''}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Processando...' : 'Enviar'}
          </button>
        </form>
        <ToastifyContainer />
        {loading && (
            <div className="loader">
              <ProgressBar height={80} width={150} barColor={"#36c76f"}/>
            </div>
        )}
      </div>
  );
}