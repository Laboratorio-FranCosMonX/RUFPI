import { Card, CardContent, CardHeader, Divider, List, ListItem, ListItemText, Typography } from "@mui/material";
import moment from "moment";
import { CardapioType, IgredienteType, PratoType, RefeicaoType } from "../utils/@types/Cardapio";

const Cardapio = ({ data, updateAt, refeicao }: CardapioType) => {

  return (
    <Card
      variant="elevation" sx={{
        width: { xs: '90%', sm: '75%', md: '50%', lg: '50%', xl: '40%' },
        padding: '10px'
      }}
    >
      <CardHeader title={`Cardapio do dia ${moment(data.getTime()).format("DD/MM/YYYY")}`}
        subheader={`Atualizado em ${moment(updateAt.getTime()).format("DD/MM/YYYY")}`} sx={{
          textAlign: "left", padding: '0px'
        }} />
      <CardContent sx={{ padding: '0px' }}>
        <List>
          {refeicao !== undefined && refeicao.map((refei: RefeicaoType) => {
            return (
              <ListItem key={`refeicao-${data.getTime()}${refei.id}`} sx={{
                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
              }}>
                <Typography margin={'0px'} variant="h5" fontWeight={"bold"} textAlign={'center'}>{`${refei.tipo}`}</Typography>
                <Divider sx={{
                  width: '100%'
                }} />
                <List sx={{
                  width: '100%'
                }}>
                  {refei.pratos.map((prato: PratoType) => {
                    return (
                      <ListItem key={`prato-${data.getTime()}${prato.id}`} sx={{
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
                            backgroundColor: '#EDEDED', borderRadius: '10%'
                          }}>
                            {prato.igredientes.map((igrediente: IgredienteType) => {
                              return (
                                <ListItem key={`igrediente-${data.getTime()}${igrediente.id}`} sx={{ margin: '0px', padding: '0px' }}>
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
                            {prato.igredientes.map((igrediente: IgredienteType) => {
                              return (
                                <ListItem key={`igredienteVeg-${data.getTime()}${igrediente.id}`} sx={{ margin: '0px', padding: '0px' }}>
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
              </ListItem>
            )
          })}
        </List>
      </CardContent>
    </Card >
  );
}

export default Cardapio;