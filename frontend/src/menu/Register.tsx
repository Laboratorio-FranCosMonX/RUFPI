import { Box, Button, Card, CardContent, CardHeader, Divider, FormControl, InputLabel, MenuItem, Modal, Select, Tooltip } from "@mui/material";
import { useState } from "react";
import { PratoType } from "../utils/@types/Cardapio";
import api from "../utils/api/api";

interface CadastrarCardapioParams {
  atualizarDados: () => void;
  fecharModal: () => void;
  callbackCadastroPrato: () => void;
}

const CadastroCardapio = ({ atualizarDados, fecharModal, callbackCadastroPrato }: CadastrarCardapioParams) => {
  const [modalOpen, setModalOpen] = useState(true)
  const [modal, setModal] = useState<{ cadastroPrato: boolean }>({
    cadastroPrato: false
  })
  const [pratos, setPratos] = useState<{ id: number, igredientes: string }[]>([])
  const [refeicoes, setRefeicoes] = useState<{ tipo: string, anotacao: string, pratos: number[] }[]>([])
  /**
   * Verifica se já existe o objeto refeição já criado
   * @param horario "Café da manhã" | "Almoço" | "Jantar"
   * @returns 
   */
  const tem_horario_refeicao = (horario: string) => {
    for (let refeicao of refeicoes) {
      if (refeicao.tipo === horario) return true;
    }
    return false;
  }

  const add_prato_em_refeicao = async (id_prato: number) => {

  }

  const handlePratos = () => {
    console.log(refeicoes)
    setModal({
      cadastroPrato: true
    })
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

  const callbackCloseModal = () => {
    setModal({
      cadastroPrato: false
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
                <MenuItem value={""}><em>None</em></MenuItem>
                <MenuItem value={"Café da manhã"}>Café da Manhã</MenuItem>
                <MenuItem value={"Almoço"}>Almoço</MenuItem>
                <MenuItem value={"Jantar"}>Jantar</MenuItem>
              </ Select>
            </FormControl>
            <Divider sx={{ marginTop: '10px', marginBottom: '10px' }} />
            <form className="global-form" style={{ width: '100%' }}>
              <FormControl
                fullWidth
                variant="filled"
                sx={{ marginBottom: '10px' }}
              >
                <InputLabel id="tipo_refeicao_registrado_label">Tipo de refeição</InputLabel>
                <Select
                  labelId="tipo_refeicao_registrado_label"
                  // value={age}
                  label={undefined}
                  sx={{
                    width: '100%'
                  }}
                // onChange={handleChange}
                >
                  <MenuItem value={""}><em>None</em></MenuItem>
                  <MenuItem value={"Normal"}>Normal</MenuItem>
                  <MenuItem value={"Vegetariano"}>Vegetariano</MenuItem>
                </ Select>
              </FormControl>
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
                  <Button onClick={() => {
                    setModalOpen(false)
                    callbackCadastroPrato();
                  }}>Novo Prato</Button>
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