import { Box, Button, Container, Divider, List, ListItem } from "@mui/material";
import { useState } from "react";
import MainMenu from "../components/MainMenu";
import Cardapio from "../menu/menu";
import { CardapioType } from "../utils/@types/Cardapio";
import api from "../utils/api/api";

const Home = () => {
  const [cardapios, setCardapios] = useState<CardapioType[]>()

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

  return (
    <Container sx={{ padding: '0px', width: "100vw", maxWidth: '100vw', minHeight: "100vh", display: 'flex', flexDirection: "column", justifyContent: "flex-start", alignItems: 'center' }}>
      <MainMenu />
      <Divider sx={{
        fontSize: '5px',
        backgroundColor: 'black',
        marginBottom: '15px'
      }} />
      <Box width={'100%'} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
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
    </Container>
  );
}

export default Home;