import styled from "styled-components";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function SessionsPage() {
  const params = useParams();
  const [sessoes, setSessoes] = useState([]);
  const [infoFilme, setInfoFilme] = useState([]);

  useEffect(() => {
    const promisse = axios.get(
      `https://mock-api.driven.com.br/api/v8/cineflex/movies/${params.idFilme}/showtimes`
    );

    promisse.then((resp) => {
      setSessoes(resp.data.days);
      setInfoFilme(resp.data);
    });
    promisse.catch((err) => alert(err.response.data));
  }, []);

  if (sessoes.length === 0) {
    return <div>Carregando...</div>;
  }

  return (
    <PageContainer>
      Selecione o horário
      <div>
        {sessoes.map((sessao) => (
          <SessionContainer data-test="movie-day" key={sessao.id}>
            {`${sessao.weekday} - ${sessao.date}`}
            <ButtonsContainer>
              <Link to={`/assentos/${sessao.showtimes[0].id}`}>
                <button data-test="showtime">{`${sessao.showtimes[0].name}`}</button>
              </Link>
              <Link to={`/assentos/${sessao.showtimes[1].id}`}>
                <button data-test="showtime">{`${sessao.showtimes[1].name}`}</button>
              </Link>
            </ButtonsContainer>
          </SessionContainer>
        ))}
      </div>
      <FooterContainer data-test="footer">
        <div>
          <img src={infoFilme.posterURL} alt={infoFilme.title} />
        </div>
        <div>
          <p>{infoFilme.title}</p>
        </div>
      </FooterContainer>
    </PageContainer>
  );
}

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-family: "Roboto";
  font-size: 24px;
  text-align: center;
  color: #293845;
  margin-top: 30px;
  padding-bottom: 120px;
  padding-top: 70px;
  div {
    margin-top: 20px;
  }
`;
const SessionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-family: "Roboto";
  font-size: 20px;
  color: #293845;
  padding: 0 20px;
`;
const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: 20px 0;
  button {
    margin-right: 20px;
  }
  a {
    text-decoration: none;
  }
`;
const FooterContainer = styled.div`
  width: 100%;
  height: 120px;
  background-color: #c3cfd9;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 20px;
  position: fixed;
  bottom: 0;

  div:nth-child(1) {
    box-shadow: 0px 2px 4px 2px #0000001a;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    margin: 12px;
    img {
      width: 50px;
      height: 70px;
      padding: 8px;
    }
  }

  div:nth-child(2) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    p {
      text-align: left;
      &:nth-child(2) {
        margin-top: 10px;
      }
    }
  }
`;
