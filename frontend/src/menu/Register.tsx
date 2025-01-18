import { Box, Button, Card, CardContent, CardHeader, Divider, FormControl, InputLabel, MenuItem, Modal, Select, Tooltip } from "@mui/material";
import { useState } from "react";
import { PratoType } from "../utils/@types/Cardapio";
import api from "../utils/api/api";

interface AtualizarSenhaParams {
  atualizarDados: () => void;
  fecharModal: () => void;
}

const CadastroCardapio = ({ atualizarDados, fecharModal }: AtualizarSenhaParams) => {
  const [modalOpen, setModalOpen] = useState(true)
  const [pratos, setPratos] = useState<{ id: number, igredientes: string }[]>([])

  const handlePratos = () => {
    api.get('/pratos')
      .then((response) => {
        const pratosType: PratoType[] = response.data
        let str = "";
        for (let p of pratosType) {

          str = ""
          for (let i of p.igredientes) {
            str += i.nome + " "
          }

          setPratos([...pratos, {
            id: p.id,
            igredientes: str
          }]);
        }
      })
  }

  const handleSubmit = () => {

  }

  return (
    <Modal
      open={modalOpen}
      onClose={() => {
        setModalOpen(false)
        fecharModal()
      }}
      sx={{
        display: "flex",
        justifyContent: "center",
        height: "maxContent",
        alignItems: "center"
      }}
    >
      <form onSubmit={handleSubmit} className="global-form">
        <Card>
          <CardHeader title="Criar Novo cardápio" subheader="Preencha as informações do cardápio diário." />
          <CardContent>
            <FormControl
              fullWidth
              variant="filled"
            >
              <InputLabel id="horario_cardapio_registrado_select_label">Horário</InputLabel>
              <Select
                labelId="horario_cardapio_registrado_select_label"
                // value={age}
                label={undefined}
                sx={{
                  width: '100%'
                }}
              // onChange={handleChange}
              >
                <MenuItem value={-1}><em>None</em></MenuItem>
                <MenuItem value={0}>Café da Manhã</MenuItem>
                <MenuItem value={1}>Almoço</MenuItem>
                <MenuItem value={2}>Jantar</MenuItem>
              </ Select>
            </FormControl>
            <Divider sx={{ marginTop: '10px', marginBottom: '10px' }} />
            <form className="global-form" style={{ width: '100%' }}>
              <Box sx={{
                maxHeight: '60vh',
                width: '100%',
                display: 'flex',
                gap: '10px'
              }}>
                <FormControl
                  fullWidth
                  variant="filled"
                >
                  <InputLabel id="prato_registrado_select_label">Prato</InputLabel>
                  <Select
                    labelId="prato_registrado_select_label"
                    id="prato_Registrado-select"
                    // value={age}
                    label={undefined}
                    sx={{
                      width: '100%'
                    }}
                  // onChange={handleChange}
                  >
                    <MenuItem value="">
                      <em>Nenhum</em>
                    </MenuItem>

                    {pratos != undefined && pratos.map((prato) => {
                      return (
                        <MenuItem key={prato.id} value={prato.id} sx={{
                          maxWidth: '70vw', overflowX: 'auto'
                        }}>
                          {prato.igredientes}
                        </MenuItem>
                      )
                    })}

                  </ Select>
                </FormControl>
                <Tooltip title="Add ao cardápio">
                  <Button aria-description="add" sx={{ fontSize: '30px', padding: '0' }}>+</Button>
                </Tooltip>
              </Box>
              <Box display={'flex'} flexDirection={"column"} justifyContent={'space-between'} marginTop={'10px'} width={'100%'} gap={1}>
                <Box display={'flex'} justifyContent={'space-between'} width={'100%'}>
                  <Button>Novo Prato</Button>
                  <Button onClick={() => {
                    handlePratos()
                  }} >Ver cardápio</Button>
                </Box>
                <Button variant="contained">Finalizar</Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </form>
    </Modal>
  )
}

export default CadastroCardapio