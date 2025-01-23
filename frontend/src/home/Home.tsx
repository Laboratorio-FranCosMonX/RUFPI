import { Box, Button, Container, Divider, LinearProgress, List, ListItem, Typography } from "@mui/material";
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
  const [homeInicializada, setHomeInicializada] = useState<'mensagem de null' | 'dados ok' | 'carregando'>('carregando')
  const [cardapios, setCardapios] = useState<CardapioType[]>()
  const [modalHome, setModalHome] = useState<ModalHomeParams>({
    cadastroCardapio: false, cadastrarPrato: false
  })

  setTimeout(() => {
    if (homeInicializada === 'carregando') {
      handleAtualizaCardpio()
    }
  }, 1000)

  const handleAtualizaCardpio = () => {
    console.log(Date.now())
    const dado = {
      data: new Date(Date.now())
    }
    api.get(`/cardapios/all`, dado)
      .then((dados) => {
        console.log(dados)
        const data: [CardapioType] = dados.data
        setCardapios(data)
        setHomeInicializada('dados ok')
        console.log(cardapios)
      })
      .catch(() => {
        setHomeInicializada('mensagem de null');
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
        {
          homeInicializada === 'carregando' &&
          <Box width={"40%"} display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
            <LinearProgress sx={{ width: '100%' }} />
            <Typography>Carregando</Typography>
          </Box>
        }
        {
          homeInicializada === 'mensagem de null' &&
          <Typography textAlign={'center'} sx={{ width: '100%' }}>Nnehum cardápio foi registrado!!!</Typography>
        }
        {
          homeInicializada === 'dados ok' &&
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
                    createdAt={new Date(cardapio.createdAt)}
                    data={new Date(cardapio.data)}
                    refeicoes={cardapio.refeicoes}
                    updatedAt={new Date(cardapio.updatedAt)}
                  />
                </ListItem>
              )
            })}
          </List>
        }
      </Box>
      {handleModal()}
    </Container>
  );
}

export default Home;