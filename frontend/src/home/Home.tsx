import { Box, Button, Container, Divider, List, ListItem } from "@mui/material";
import { useState } from "react";
import MainMenu from "../components/MainMenu";
import Cardapio from "../menu/menu";
import RegistrarPrato from "../menu/plate/Register";
import CadastroCardapio from "../menu/Register";
import { CardapioType } from "../utils/@types/Cardapio";
import api from "../utils/api/api";

interface ModalHomeParams {
  cadastroCardapio: boolean
  cadastrarPrato: boolean
}

const Home = () => {
  const [cardapios, setCardapios] = useState<CardapioType[]>()
  const [modalHome, setModalHome] = useState<ModalHomeParams>({
    cadastroCardapio: false, cadastrarPrato: false
  })

  const handleAtualizaCardpio = () => {
    console.log(Date.now())
    const dado = {
      data: new Date(Date.now())
    }
    api.get(`/cardapio/`, dado)
      .then((dados) => {
        const data: [CardapioType] = dados.data
        setCardapios(data)
        console.log(cardapios)
      })
  }

  //callbacks
  const callbackCloseModal = () => {
    setModalHome({
      ...modalHome,
      cadastroCardapio: false,
      cadastrarPrato: false
    })
  }

  const callbackRedirecionarParaCadastroPrato = () => {
    setModalHome({
      ...modalHome,
      cadastrarPrato: true
    })
  }

  const handleModal = () => {
    if (!modalHome.cadastroCardapio && !modalHome.cadastrarPrato)
      return null;

    if (modalHome.cadastrarPrato)
      return (
        <RegistrarPrato
          fecharModal={callbackCloseModal}
        />
      )

    return (
      < CadastroCardapio
        fecharModal={callbackCloseModal}
        atualizarDados={handleAtualizaCardpio}
        callbackCadastroPrato={callbackRedirecionarParaCadastroPrato}
      />
    )
  }

  return (
    <Container sx={{ padding: '0px', width: "100vw", maxWidth: '100vw', minHeight: "100vh", display: 'flex', flexDirection: "column", justifyContent: "flex-start", alignItems: 'center' }}>
      <MainMenu />
      <Divider sx={{
        fontSize: '5px',
        backgroundColor: 'black',
        marginBottom: '15px'
      }} />
      <Box width={'100%'} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} position={'relative'} marginTop={'50px'}>
        <Button
          variant="contained"
          sx={{
            position: 'fixed', right: '15px', top: '60px', zIndex: '10', opacity: `10%`, ':hover': {
              opacity: `100%`
            }
          }}
          onClick={() => {
            console.log("abertura do cadastro " + modalHome.cadastroCardapio)
            setModalHome({
              ...modalHome,
              cadastroCardapio: true
            })
          }}
        >Novo Cardápio</Button>
        <List
          sx={{ width: '100%' }}
        >
          {cardapios !== undefined && cardapios.map((cardapio: CardapioType) => {
            return (
              <ListItem key={cardapio.id} sx={{
                width: '100%',
                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignIten: 'center'
              }}>
                <Cardapio
                  createAt={new Date(cardapio.createAt)}
                  data={new Date(cardapio.data)}
                  refeicao={cardapio.refeicao}
                  updateAt={new Date(cardapio.updateAt)}
                />
              </ListItem>
            )
          })}
        </List>
      </Box>
      <Button onClick={() => handleAtualizaCardpio()}>Load</Button>
      {handleModal()}
    </Container>
  );
}

export default Home;