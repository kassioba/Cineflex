import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

export default function SeatsPage({
  infos,
  setInfos,
  setDados,
  numeroAssento,
  setNumeroAssento,
}) {
  const params = useParams();
  const [assentos, setAssentos] = useState([]);
  const [assentosSelecionados, setAssentosSelecionados] = useState([]);
  const [filmeInfos, setFilmeInfos] = useState([]);
  const [nome, setNome] = useState([]);
  const [cpf, setCpf] = useState([]);
  const navigate = useNavigate();

  function escolherAssento(a, b, c) {
    let assentosSelecionadosCopia = [...assentosSelecionados];
    let numeroAssentoCopia = [...numeroAssento];
    if (assentosSelecionadosCopia.includes(a)) {
      assentosSelecionadosCopia.splice(assentosSelecionadosCopia.indexOf(a), 1);
    } else if (b !== false) {
      assentosSelecionadosCopia = [...assentosSelecionados, a];
    } else {
      alert("Esse assento não está disponível");
    }

    if (numeroAssentoCopia.includes(c)) {
      numeroAssentoCopia.splice(numeroAssentoCopia.indexOf(c), 1);
    } else {
      numeroAssentoCopia = [...numeroAssento, c];
    }
    setAssentosSelecionados(assentosSelecionadosCopia);
    setNumeroAssento(numeroAssentoCopia.sort());
  }

  function enviarDados(e) {
    e.preventDefault();

    if (assentosSelecionados.length === 0) {
      return alert("Por favor, selecione um assento");
    }

    const dadosCopia = {
      ids: assentosSelecionados,
      name: nome,
      cpf: cpf,
    };
    setDados(dadosCopia);

    const promessa = axios.post(
      "https://mock-api.driven.com.br/api/v8/cineflex/seats/book-many",
      dadosCopia
    );

    promessa.then(() => navigate("/sucesso"));
  }

  useEffect(() => {
    const promessa = axios.get(
      `https://mock-api.driven.com.br/api/v8/cineflex/showtimes/${params.idSessao}/seats`
    );

    promessa.then((resp) => {
      setAssentos(resp.data.seats);
      setFilmeInfos(resp.data.movie);
      setInfos(resp.data);
    });
    promessa.catch((err) => alert("A requisição falhou"));
  }, []);

  if (assentos.length < 1 || filmeInfos.length < 1 || infos.length < 1) {
    return <div>Carregando...</div>;
  }

  return (
    <PageContainer>
      Selecione o(s) assento(s)
      <SeatsContainer>
        {assentos.map((assento) => (
          <SeatItem
            data-test="seat"
            onClick={() =>
              escolherAssento(assento.id, assento.isAvailable, assento.name)
            }
            assentosSelecionados={assentosSelecionados}
            disponibilidade={assento.isAvailable}
            id={assento.id}
            key={assento.id}
          >
            {assento.name}
          </SeatItem>
        ))}
      </SeatsContainer>
      <CaptionContainer>
        <CaptionItem>
          <CaptionCircle status="selecionado" />
          Selecionado
        </CaptionItem>
        <CaptionItem>
          <CaptionCircle status="disponível" />
          Disponível
        </CaptionItem>
        <CaptionItem>
          <CaptionCircle status="indisponível" />
          Indisponível
        </CaptionItem>
      </CaptionContainer>
      <FormContainer onSubmit={enviarDados}>
        Nome do Comprador:
        <input
          data-test="client-name"
          placeholder="Digite seu nome..."
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        CPF do Comprador:
        <input
          data-test="client-cpf"
          placeholder="Digite seu CPF..."
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          required
        />
        <button data-test="book-seat-btn" type="submit">
          Reservar Assento(s)
        </button>
      </FormContainer>
      <FooterContainer data-test="footer">
        <div>
          <img src={`${filmeInfos.posterURL}`} alt="poster" />
        </div>
        <div>
          <p>{`${filmeInfos.title}`}</p>
          <p>{`${infos.day.weekday} - ${infos.name}`}</p>
        </div>
      </FooterContainer>
    </PageContainer>
  );
}

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Roboto";
  font-size: 24px;
  text-align: center;
  color: #293845;
  margin-top: 30px;
  padding-bottom: 120px;
  padding-top: 70px;
`;
const SeatsContainer = styled.div`
  width: 330px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;
const FormContainer = styled.form`
  width: calc(100vw - 40px);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 20px 0;
  font-size: 18px;
  button {
    align-self: center;
  }
  input {
    width: calc(100vw - 60px);
  }
`;
const CaptionContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 300px;
  justify-content: space-between;
  margin: 20px;
`;
const CaptionCircle = styled.div`
  border: ${(props) =>
    props.status === "indisponível"
      ? "1px solid #F7C52B"
      : props.status === "selecionado"
      ? "1px solid #0E7D71"
      : "1px solid #7B8B99"}; // Essa cor deve mudar
  background-color: ${(props) =>
    props.status === "indisponível"
      ? "#FBE192"
      : props.status === "selecionado"
      ? "#1AAE9E"
      : "#C3CFD9"}; // Essa cor deve mudar
  height: 25px;
  width: 25px;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5px 3px;
`;
const CaptionItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
`;
const SeatItem = styled.div`
  border: ${(props) =>
    props.disponibilidade === false
      ? "1px solid #F7C52B"
      : props.assentosSelecionados.includes(props.id)
      ? "1px solid #0E7D71"
      : "1px solid #808F9D"}; // Essa cor deve mudar
  background-color: ${(props) =>
    props.disponibilidade === false
      ? "#FBE192"
      : props.assentosSelecionados.includes(props.id)
      ? "#1AAE9E"
      : "#C3CFD9"}; // Essa cor deve mudar
  height: 25px;
  width: 25px;
  border-radius: 25px;
  font-family: "Roboto";
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5px 3px;
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
