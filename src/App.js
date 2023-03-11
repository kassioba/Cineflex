import styled from "styled-components";
import HomePage from "./pages/HomePage/HomePage";
import SeatsPage from "./pages/SeatsPage/SeatsPage";
import SessionsPage from "./pages/SessionsPage/SessionsPage";
import SuccessPage from "./pages/SuccessPage/SuccessPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

export default function App() {
  const [listaFilmes, setListaFilmes] = useState([]);
  const [infos, setInfos] = useState([]);
  const [dados, setDados] = useState([]);
  const [numeroAssento, setNumeroAssento] = useState([]);

  useEffect(() => {
    const promessa = axios.get(
      "https://mock-api.driven.com.br/api/v8/cineflex/movies"
    );

    promessa.then((resp) => {
      setListaFilmes(resp.data);
    });
    promessa.catch(() => alert("Requisição falhou"));
  }, []);

  return (
    <BrowserRouter>
      <NavContainer>CINEFLEX</NavContainer>
      <Routes>
        <Route path="/" element={<HomePage listaFilmes={listaFilmes} />} />
        <Route path="/sessoes/:idFilme" element={<SessionsPage />} />
        <Route
          path="/assentos/:idSessao"
          element={
            <SeatsPage
              infos={infos}
              setInfos={setInfos}
              setDados={setDados}
              numeroAssento={numeroAssento}
              setNumeroAssento={setNumeroAssento}
            />
          }
        />
        <Route
          path="/sucesso"
          element={
            <SuccessPage
              dados={dados}
              infos={infos}
              numeroAssento={numeroAssento}
              setNumeroAssento={setNumeroAssento}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

const NavContainer = styled.div`
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #c3cfd9;
  color: #e8833a;
  font-family: "Roboto", sans-serif;
  font-size: 34px;
  position: fixed;
  top: 0;
  a {
    text-decoration: none;
    color: #e8833a;
  }
`;
