import { Box, Button, Card, CardContent, CardHeader, Divider, FormControl, InputLabel, MenuItem, Modal, Select, SelectChangeEvent, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { PratoType } from "../utils/@types/Cardapio";
import api from "../utils/api/api";

interface CadastrarCardapioParams {
  atualizarDados: () => void;
  fecharModal: () => void;
  callbackCadastroPrato: () => void;
}

interface PreencherCardapioParams {
  horario: string
  tipo_prato: string
  prato_id: string
}

const CadastroCardapio = ({ atualizarDados, fecharModal, callbackCadastroPrato }: CadastrarCardapioParams) => {
  const [modalOpen, setModalOpen] = useState(true)
  const [modalInicializado, setModalInicializado] = useState(false)
  const [modal, setModal] = useState<{ cadastroPrato: boolean }>({
    cadastroPrato: false
  })
  const [dadosParaGravar, setDadosParaGravar] = useState<PreencherCardapioParams>({
    horario: '', tipo_prato: '', prato_id: ""
  })
  const [pratos, setPratos] = useState<{ id: number, preferencia_alimentar: string, igredientes: string }[]>([])
  const [refeicoes, setRefeicoes] = useState<{ tipo: string, anotacao: string, pratos: number[], tem_dados: boolean }[]>([
    { tem_dados: false, anotacao: "", pratos: [], tipo: "Café da manhã" },
    { tem_dados: false, anotacao: "", pratos: [], tipo: "Almoço" },
    { tem_dados: false, anotacao: "", pratos: [], tipo: "Jantar" }
  ])

  useEffect(() => {
    if (!modalInicializado) {
      setModalInicializado(true)
      setTimeout(() => {
        handlePratos()
      }, 700)
    }
  }, [modalInicializado])

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
    if (dadosParaGravar.horario === "" || dadosParaGravar.tipo_prato === "") {
      console.log("Preencha o formulário corretamente")
    }

    if (refeicoes.length === 0) {
      // setRefeicoes([...refeicoes, {
      //   anotacao: "",
      //   pratos: [parseInt(dadosParaGravar.prato_id)],
      //   tipo: dadosParaGravar.tipo_prato
      // }])

      return;
    }

    if (dadosParaGravar.horario === "Café da manhã") {

    }
  }

  const handlePratos = () => {
    console.log(refeicoes)
    setModal({
      cadastroPrato: true
    })
    api.get('/pratos/all')
      .then((response) => {
        if (response.data.length <= 0) return;

        const pratosType: PratoType[] = response.data
        let str = "";
        for (let p of pratosType) {

          str = "";
          for (let i of p?.ingredientes) {
            str += i.nome + ", "
          }

          // Remove os dois últimos caracteres (", ")
          str = str.slice(0, -2);
          str += "."

          setPratos([...pratos, {
            id: p.id,
            preferencia_alimentar: p.preferencia_alimentar,
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
        <Card sx={{
          width: { xs: '50%', sm: '70%', md: '80%', lg: '90%', xl: '70%' },
          minWidth: '381px'
        }}>
          <CardHeader title="Criar Novo cardápio" subheader="Preencha as informações do cardápio diário." />
          <CardContent>
            <FormControl
              fullWidth
              variant="filled"
            >
              <InputLabel id="horario_cardapio_registrado_select_label">Horário</InputLabel>
              <Select
                labelId="horario_cardapio_registrado_select_label"
                value={dadosParaGravar.horario}
                sx={{
                  width: '100%'
                }}
                onChange={(event: SelectChangeEvent) => {
                  setDadosParaGravar({
                    ...dadosParaGravar,
                    horario: event.target.value as string
                  });
                }}
              >
                <MenuItem value={''}><em>Nenhum</em></MenuItem>
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
                  value={dadosParaGravar.tipo_prato}
                  label={undefined}
                  sx={{
                    width: '100%'
                  }}
                  onChange={(event: SelectChangeEvent) => {
                    setDadosParaGravar({
                      ...dadosParaGravar,
                      tipo_prato: event.target.value as string
                    });
                  }}
                >
                  <MenuItem value={''}><em>Nnehum</em></MenuItem>
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
                    value={dadosParaGravar.prato_id + ""}
                    label={undefined}
                    sx={{
                      width: '100%'
                    }}
                    onChange={(event: SelectChangeEvent) => {
                      setDadosParaGravar({
                        ...dadosParaGravar,
                        prato_id: event.target.value
                      });
                    }}
                  >

                    { }<MenuItem value={""}>
                      <em>Nenhum</em>
                    </MenuItem>

                    {pratos != undefined && pratos.map((prato) => {
                      return (
                        <MenuItem key={prato.id} value={prato.id + ""} sx={{
                          maxWidth: '70vw', overflowX: 'auto'
                        }}>
                          {prato.preferencia_alimentar + ": " + prato.igredientes}
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