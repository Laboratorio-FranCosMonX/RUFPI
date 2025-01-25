import { AlertColor, Box, Button, Card, CardContent, CardHeader, Divider, FormControl, FormHelperText, InputLabel, MenuItem, Modal, Select, SelectChangeEvent, Tooltip } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import AlertSnackBar from "../components/InformSystem";
import { PratoType } from "../utils/@types/Cardapio";
import api from "../utils/api/api";

interface CadastrarCardapioParams {
  atualizarDados: () => void;
  fecharModal: () => void;
  callbackCadastroPrato: () => void;
}

interface PreencherCardapioParams {
  horario: string
  prato_id: string
  preferencia_alimentar: "geral" | "vegetariano" | ""
}

const CadastroCardapio = ({ atualizarDados, fecharModal, callbackCadastroPrato }: CadastrarCardapioParams) => {
  const [modalOpen, setModalOpen] = useState(true)
  const [modalInicializado, setModalInicializado] = useState(false)
  const [allPratos, setAllPratos] = useState<PratoType[]>([])
  const [dadosParaGravar, setDadosParaGravar] = useState<PreencherCardapioParams>({
    horario: '', prato_id: "", preferencia_alimentar: ""//ajudar na verificacao
  })
  const [pratos, setPratos] = useState<{ id: number, preferencia_alimentar: string, igredientes: string }[]>([])
  const [refeicoes, setRefeicoes] = useState<{ temVegetariano: boolean, temGeral: boolean, tipo: string, anotacao: string, pratos: number[], tem_dados: boolean }[]>([
    { tem_dados: false, anotacao: "", pratos: [], tipo: "Café da manhã", temGeral: false, temVegetariano: false },
    { tem_dados: false, anotacao: "", pratos: [], tipo: "Almoço", temGeral: false, temVegetariano: false },
    { tem_dados: false, anotacao: "", pratos: [], tipo: "Jantar", temGeral: false, temVegetariano: false }
  ])
  const [error, setError] = useState<{ error_horario: boolean, error_prato: boolean, message_horario: string, message_prato: string }>({
    error_horario: false, error_prato: false, message_horario: "", message_prato: ""
  })
  const [messageSystem, setMessageSystem] = useState<{ visivel: boolean, message: string, color: AlertColor, duracao: number }>({
    message: '', color: 'info', duracao: 4, visivel: false
  })

  useEffect(() => {
    if (!modalInicializado) {
      setModalInicializado(true)
      setTimeout(() => {
        handlePratos()
      }, 700)
    }
  }, [modalInicializado])

  const procuraPrato = (search_id: number): PratoType | null => {
    console.log("todos os pratos")
    console.log(allPratos)
    for (let p of allPratos) {
      if (p.id === search_id) return p;
    }
    return null;
  }

  const add_prato_em_refeicao = () => {
    if (dadosParaGravar.horario === "") {
      setError({
        ...error,
        message_horario: "Escolha algum horário.",
        error_horario: true
      })
    }
    if (dadosParaGravar.prato_id === "") {
      setError({
        ...error,
        message_prato: "Escolha um prato para adicionar ao cardápio.",
        error_prato: true
      })
    }

    if (error.error_horario || error.error_prato) return;
    // console.log("user id:" + api.defaults.data.user.id)
    // console.log("addicionando")
    const pratoIndex = procuraPrato(parseInt(dadosParaGravar.prato_id))

    let adicionado = false
    setRefeicoes(prevRefeicoes => {
      return (
        prevRefeicoes.map(refeicao => {
          const ainda_nao_registrado = pratoIndex?.preferencia_alimentar === "geral" && !refeicao.temGeral || pratoIndex?.preferencia_alimentar === "vegetariano" && !refeicao.temVegetariano
          const condicao_para_adicionar = refeicao.tipo === dadosParaGravar.horario && ainda_nao_registrado

          let lista_pratos = refeicao.pratos
          if (condicao_para_adicionar) {
            adicionado = true;
            lista_pratos.push(parseInt(dadosParaGravar.prato_id))
          }

          return (
            condicao_para_adicionar && refeicao.pratos.length < 3 ? {
              ...refeicao,
              tem_dados: true,
              anotacao: "",
              pratos: lista_pratos,
              temGeral: pratoIndex?.preferencia_alimentar === "geral" ? true : refeicao.temGeral,
              temVegetariano: pratoIndex?.preferencia_alimentar === "vegetariano" ? true : refeicao.temVegetariano
            }
              : refeicao
          )
        })
      )
    })

    if (adicionado) {
      setDadosParaGravar({
        horario: "",
        prato_id: "",
        preferencia_alimentar: ""
      })
      setRefeicoes(refeicoes)
    }
    // console.log(refeicoes)
  }

  const handlePratos = () => {
    // console.log(refeicoes)
    api.get('/pratos/all')
      .then((response) => {
        if (response.data.length <= 0) return;
        setAllPratos(response.data);

        const pratosType: PratoType[] = response.data
        let str = "";

        let aux: { id: number, preferencia_alimentar: string, igredientes: string }[] = []
        for (let p of pratosType) {

          str = "";
          for (let i of p?.ingredientes) {
            str += i.nome + ", "
          }

          // Remove os dois últimos caracteres (", ")
          str = str.slice(0, -2);
          str += "."

          aux.push({
            id: p.id,
            preferencia_alimentar: p.preferencia_alimentar,
            igredientes: str
          });
        }
        setPratos(aux)
      })
  }

  const handleSubmit = async () => {

    let id_refeicoes = []
    //criando refeicao
    for (let refeicao of refeicoes) {
      if (refeicao.pratos.length > 0) {
        console.log(refeicao.pratos)
        try {
          const response = await api.post("/refeicoes/create", {
            "tipo": refeicao.tipo,
            "anotacao": refeicao.anotacao + "",
            "pratos": refeicao.pratos
          })

          id_refeicoes.push(parseInt(response.data.refeicao.id))
        } catch (error) {
          setMessageSystem({
            color: 'error',
            duracao: 4,
            message: `problema ao registrar refeições.`,
            visivel: true
          })

          setTimeout(() => {
            setMessageSystem({
              ...messageSystem,
              visivel: false
            })
          }, 4000)
          return;
        }
      }
    }
    // console.log(id_refeicoes)
    // console.log(moment(new Date(Date.now()).getTime()).format("DD-MM-YYYY"))
    if (id_refeicoes.length > 0) {
      api.post("/cardapios/create", {
        data: moment(new Date(Date.now()).getTime()).format("DD-MM-YYYY"),
        refeicoes: id_refeicoes,
        user_id: parseInt(api.defaults.data.user.id)
      }).then(() => {
        setMessageSystem({
          color: 'success',
          duracao: 4,
          message: `Cardápio criado com êxito!`,
          visivel: true
        })

        setTimeout(() => {
          setMessageSystem({
            ...messageSystem,
            visivel: false
          })
          atualizarDados()
          fecharModal()
        }, 4000)
        // console.log("Cadastro do cardápio executado com exito")
      }).catch((/*error*/) => {
        setMessageSystem({
          color: 'error',
          duracao: 4,
          message: `problema ao registrar Cadastro.`,
          visivel: true
        })

        setTimeout(() => {
          setMessageSystem({
            ...messageSystem,
            visivel: false
          })
        }, 4000)
        // console.error("Cadastro do cardápio não executado")
        // console.log(error)
      })
    }
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
              error={error.error_horario}
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
                  setError({
                    ...error,
                    error_horario: false
                  })
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
              {error.error_horario && <FormHelperText>{error.message_horario}</FormHelperText>}
            </FormControl>
            <Divider sx={{ marginTop: '10px', marginBottom: '10px' }} />
            <Box sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative'
            }}>

              <Box sx={{
                maxHeight: '60vh',
                width: '100%',
                display: 'flex',
                gap: '10px'
              }}>
                <FormControl
                  fullWidth
                  error={error.error_prato}
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
                      setError({
                        ...error,
                        error_prato: false
                      })
                      setDadosParaGravar({
                        ...dadosParaGravar,
                        prato_id: event.target.value
                      });
                    }}
                  >
                    <MenuItem key={0} value={""}>
                      <em>Nenhum</em>
                    </MenuItem>
                    {pratos != undefined && pratos.length > 0 && pratos.map((prato) => {
                      return (
                        <MenuItem key={prato.id + 1} value={prato.id + ""} sx={{
                          maxWidth: '70vw', overflowX: 'auto'
                        }}>
                          {prato.preferencia_alimentar + ": " + prato.igredientes}
                        </MenuItem>
                      )
                    })}

                  </ Select>
                  {error.error_prato && <FormHelperText>{error.message_prato}</FormHelperText>}
                </FormControl>
                <Tooltip title="Add ao cardápio">
                  <Button aria-description="add" sx={{ fontSize: '30px', padding: '0' }}
                    onClick={() => {
                      add_prato_em_refeicao()
                    }}>+</Button>
                </Tooltip>
              </Box>
              <Box display={'flex'} flexDirection={"column"} justifyContent={'space-between'} marginTop={'10px'} width={'100%'} gap={1}>
                <Box display={'flex'} justifyContent={'space-between'} width={'100%'}>
                  <Button onClick={() => {
                    fecharModal()
                    setModalOpen(false)
                    callbackCadastroPrato();
                  }}>Novo Prato</Button>
                  <Button onClick={() => {
                    handlePratos()
                  }} >Ver cardápio</Button>
                </Box>
                <Button variant="contained" onClick={() => {
                  // console.log(refeicoes)
                  handleSubmit()
                }}>Finalizar</Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
        {
          messageSystem.visivel &&
          <AlertSnackBar
            message={messageSystem.message}
            severityMessage={messageSystem.color}
            alignHorizontal="center"
            alignVertical="top"
            duracao={messageSystem.duracao}
          />
        }
      </form>
    </Modal>
  )
}

export default CadastroCardapio