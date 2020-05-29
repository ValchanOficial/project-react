import React, { useState, useEffect, FormEvent } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import api from '../../services/api';

import { ReactComponent as Logo } from '../../assets/logo.svg';

import { Title, Form, Repositories, Error } from './style';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('');
  const [inputError, setInputError] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storagedRepositories = localStorage.getItem('@GithubExplorer:repositories');
    return storagedRepositories ? JSON.parse(storagedRepositories) : [];
  });

  useEffect(() => {
    localStorage.setItem('@GithubExplorer:repositories', JSON.stringify(repositories));
  },[repositories]);

  const handleAddRepository = async (event: FormEvent<HTMLFormElement>) : Promise<void> => {
    event.preventDefault();

    if(!newRepo) {
      setInputError('Digite o autor/nome do repositório');
      return;
    }

    try {
      const response = await api.get<Repository>(`repos/${newRepo}`);
      const repository = response.data;
      setRepositories([...repositories, repository])
      setNewRepo('');
      setInputError('');
    } catch {
      setInputError('Erro na busca por esse repositório');
    }
  }

  return (
    <>
      <Logo/>
      <Title>Explore repositórios no GitHub</Title>
      <Form hasError={!!inputError} onSubmitCapture={handleAddRepository}>
        <input
          value={newRepo}
          onChange={e => setNewRepo(e.target.value)}
          type="text"
          placeholder="Digite aqui"
        />
        <button type="submit">Pesquisar</button>
      </Form>
      {inputError && <Error>{inputError}</Error>}
      <Repositories>
        {repositories.map((repository:Repository) => (
          <Link to={`/repository/${repository.full_name}`} key={repository.full_name}>
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
            <FiChevronRight size={20}/>
          </Link>
        ))}
      </Repositories>
    </>
  )
}

export default Dashboard;
