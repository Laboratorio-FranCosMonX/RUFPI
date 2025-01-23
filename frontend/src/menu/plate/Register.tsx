import { Box, Button, Card, CardContent, CardHeader, FormControl, FormHelperText, InputLabel, MenuItem, Modal, Select, SelectChangeEvent, Tooltip } from "@mui/material";
import { useState } from "react";
import { IngredienteType } from "../../utils/@types/Cardapio";
import api from "../../utils/api/api";

interface CadastrarPratoParams {
  fecharModal: () => void;
}

const RegistrarPrato = ({ fecharModal }: CadastrarPratoParams) => {
  const [modalPratoOpen, setModalPratoOpen] = useState(true)
  const [modalInicializado, setModalInicializado] = useState(false)
  const [preferenciaAlimentar, setPreferenciaAlimentar] = useState<"" | "geral" | "vegetariano">('')
  const [ingredienteId, setIngredienteId] = useState('')
  const [ingredientes, setIngredientes] = useState<IngredienteType[]>([])
  const [dadosASeremEnviados, setDadosASeremEnviados] = useState<{ ingredientes: number[] }>({
    ingredientes: []
  })
  const [erroPreferencia, setErroPreferencia] = useState<{ message: string, error: boolean }>({
    message: 'Escolha uma opção', error: false
  })

  setTimeout(() => {
    if (!modalInicializado) {
      setModalInicializado(true)
      handleIngredientes()
    }
  }, 500)

  const handleIngredientes = () => {
    api.get('/ingredientes/all')
      .then((response) => {
        console.log(response)
        setIngredientes(response.data)
      }).catch((error) => {
        console.error(error)
      })
  }

  const add_ao_prato = () => {
    let v: number[] = dadosASeremEnviados?.ingredientes
    v.push(parseInt(ingredienteId))
    setDadosASeremEnviados({
      ingredientes: v
    })
    console.log("adicionado")
  }

  const handleSubmit = () => {
    api.post("/pratos/create", {
      preferencia_alimentar: preferenciaAlimentar,
      ingredientes: dadosASeremEnviados.ingredientes
    }).then(() => alert("Prato Criado com exito!"))
      .catch(() => alert("Houve um problema ao criar o prato."))
  }

  return (
    <Modal
      open={modalPratoOpen}
      onClose={() => {
        setModalPratoOpen(false)
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
          <CardHeader title="Criar Novo Prato" subheader="Preencha as informações do novo prato." />
          <CardContent>
            <FormControl
              fullWidth
              error={erroPreferencia.error}
              variant="filled"
            >
              <InputLabel id="preferencia_prato_registrado_select_label">Preferência Alimentar</InputLabel>
              <Select
                labelId="preferencia_prato_registrado_select_label"
                value={preferenciaAlimentar}
                sx={{
                  width: '100%'
                }}
                onChange={(event: SelectChangeEvent) => {
                  setErroPreferencia({
                    ...erroPreferencia,
                    error: false
                  })
                  setPreferenciaAlimentar(event.target.value as "" | "geral" | "vegetariano");
                }}
              >
                <MenuItem value={""}><em>Nenhum</em></MenuItem>
                <MenuItem value={"geral"}>Geral</MenuItem>
                <MenuItem value={"vegetariano"}>Vegetariano</MenuItem>
              </ Select>
              {erroPreferencia.error && <FormHelperText>{erroPreferencia.message}</FormHelperText>}
            </FormControl>
            <Box sx={{
              maxHeight: '60vh',
              width: '100%',
              display: 'flex',
              gap: '10px'
            }}>
              <FormControl
                fullWidth
                error={erroPreferencia.error}
                variant="filled"
              >
                <InputLabel id="ingrediente_para_prato_registrado_select_label">Ingredientes</InputLabel>
                <Select
                  labelId="ingrediente_para_prato_registrado_select_label"
                  value={ingredienteId}
                  sx={{
                    width: '100%'
                  }}
                  onChange={(event: SelectChangeEvent) => {
                    setIngredienteId(event.target.value as string);
                  }}
                >
                  <MenuItem key={''} value={''}><em>Nenhum</em></MenuItem>
                  {ingredientes.map((ingrediente) => {
                    return (
                      <MenuItem key={`${ingrediente.id}`} value={`${ingrediente.id}`}>{ingrediente.nome}</MenuItem>
                    )
                  })}
                </ Select>
              </FormControl>
              <Tooltip title="Add ao prato">
                <Button aria-description="add" sx={{ fontSize: '30px', padding: '0' }}
                  onClick={() => {
                    add_ao_prato()
                  }}>+</Button>
              </Tooltip>
            </ Box>
            <Button variant="contained" onClick={() => handleSubmit()}>Finalizar</Button>
          </CardContent>
        </Card>
      </form>
    </Modal>
  )
}

export default RegistrarPrato;