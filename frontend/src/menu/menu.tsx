import { Button, Card, CardContent, CardHeader, Divider, List, ListItem, ListItemText, Typography } from "@mui/material";
import { useState } from "react";
import api from "../utils/api/api";

interface Igrediente {
  id: number
  nome: string
}

interface Prato {
  id: number
  preferencia_alimentar: 'geral' | 'vegetariano'
  igredientes: [Igrediente]
}

interface Refeicao {
  id: number
  tipo: 'almoço' | 'jantar' | 'café da manhã',
  anotacao: string
  pratos: [Prato]
}

interface Cardapio {
  id: number
  data: string
  createAt: string
  updateAt: string
  refeicao: [Refeicao]
}

const Cardapio = () => {

  // const [cardapio, setCardapio] = useState<Cardapio>({
  //   id:0, anotacao: "", createAt: Date.UTC(2025,1,1).toString(), updateAt: Date.UTC(2025,1,1).toString(), data: Date.UTC(2025,1,1).toString(), 
  //   descricao: "", horarioRefeicao: "almoço", prato: []
  // })
  const [cardapio, setCardapio] = useState<[Cardapio]>()

  const handleAtualizaCardpio = () => {
    const dado = {
      data: "2025/01/09"
    }
    api.get(`/cardapio/`, dado)
      .then((dados) => {
        const data: [Cardapio] = dados.data
        setCardapio(data)
        console.log(cardapio)
      })
  }

  return (
    <Card
      variant="elevation" sx={{
        width: { xs: '90%', sm: '75%', md: '50%', lg: '50%', xl: '40%' },
        padding: '10px'
      }}
    >
      <CardHeader title={`Cardapio do dia`} subheader={`${cardapio !== undefined && cardapio[0].data}`} sx={{
        textAlign: "left", padding: '0px'
      }} />
      <CardContent sx={{ padding: '0px' }}>
        <Typography margin={'0px'} variant="h5" fontWeight={"bold"} textAlign={'center'}>{`${cardapio !== undefined && cardapio[0].refeicao[0].tipo}`}</Typography>
        <Divider />
        <List sx={{
          width: '100%', borderBottom: '0.2px solid gray', borderRadius: '11%'
        }}>
          {cardapio != undefined && cardapio[0].refeicao[0].pratos.map((prato: Prato) => {
            return (
              <ListItem key={prato.id} sx={{
                margin: '0px', padding: '0px', width: "100%", display: 'flex', justifyContent: 'center', alignItens: 'center',
              }}>
                <Typography
                  textAlign={'center'}
                  sx={{
                    minWidth: '135px'
                  }}>{`Cardápio ${prato.preferencia_alimentar}`}</Typography>
                {
                  prato.preferencia_alimentar === "geral" &&
                  <List sx={{
                    padding: '0px', margin: '0px', marginTop: '10px', width: '100%', borderLeft: '.5px solid gray',
                    backgroundColor: '#EDEDED', borderRadius: '16%'
                  }}>
                    {prato.igredientes.map((igrediente: Igrediente) => {
                      return (
                        <ListItem key={igrediente.id} sx={{ margin: '0px', padding: '0px' }}>
                          <ListItemText>
                            <Typography width={"100%"} variant="body1" color="black" textAlign={"center"}>{`${igrediente.nome}`}</Typography>
                          </ListItemText>
                        </ListItem>
                      )
                    })}
                  </List>
                }
                {
                  prato.preferencia_alimentar === "vegetariano" &&
                  <List sx={{
                    padding: '0px', margin: '0px', marginTop: '10px', width: '100%', borderLeft: '.5px solid gray',
                    backgroundColor: '#BCFFB0', borderRadius: '16%'
                  }}>
                    {prato.igredientes.map((igrediente: Igrediente) => {
                      return (
                        <ListItem key={igrediente.id} sx={{ margin: '0px', padding: '0px' }}>
                          <ListItemText>
                            <Typography width={"100%"} variant="body1" color="black" textAlign={"center"}>{`${igrediente.nome}`}</Typography>
                          </ListItemText>
                        </ListItem>
                      )
                    })}
                  </List>
                }
              </ListItem>
            )
          })}
        </List>
        <Button onClick={() => {
          handleAtualizaCardpio()
        }}>Teste</Button>
      </CardContent>
    </Card >
  );
}

export default Cardapio;