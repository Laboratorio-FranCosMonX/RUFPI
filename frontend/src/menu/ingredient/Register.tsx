import { AlertColor, Button, Card, CardContent, CardHeader, Modal, TextField } from "@mui/material";
import { useState } from "react";
import AlertSnackBar from "../../components/InformSystem";
import api from "../../utils/api/api";

interface CadastrarIngredienteParams {
  fecharModal: () => void;
}

const RegistrarIngrediente = ({ fecharModal }: CadastrarIngredienteParams) => {
  const [modalOpen, setModalOpen] = useState(true)
  const [nome, setNome] = useState("")
  const [errorNome, setErrorNome] = useState<{ message: string, error: boolean }>({
    message: 'O campo não pode estar vazio', error: false
  })
  const [messageSystem, setMessageSystem] = useState<{ visivel: boolean, message: string, color: AlertColor, duracao: number }>({
    message: '', color: 'info', duracao: 4, visivel: false
  })

  const handleSubmit = () => {
    if (nome.length <= 0) {
      setErrorNome({
        message: "O campo não pode estar vazio.",
        error: true
      })
      return
    }

    api.post("ingredientes/create", { "nome": nome })
      .then(() => {
        setMessageSystem({
          color: "success",
          duracao: 4,
          message: "Ingrediente registrado com sucesso.",
          visivel: true
        })

        setTimeout(() => {
          setMessageSystem({
            ...messageSystem,
            visivel: false
          })
        }, 4000)
      })
      .catch(() => {
        setMessageSystem({
          color: "error",
          duracao: 4,
          message: "Falha ao registrar o ingrediente.",
          visivel: true
        })

        setTimeout(() => {
          setMessageSystem({
            ...messageSystem,
            visivel: false
          })
        }, 4000)
      })
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
          <CardHeader title="Criar Novo Ingrediente" subheader="Cadastre um novo ingredient, como: Moqueca de banana." />
          <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <TextField
              label={"Informe o nome do ingrediente"}
              value={nome}
              type={'text'}
              error={errorNome.error}
              helperText={errorNome.error ? errorNome.message : ""}
              fullWidth
              onChange={(e) => {
                setNome(e.target.value)
                if (errorNome.error && e.target.value.length > 0) {
                  setErrorNome({
                    ...errorNome,
                    error: false
                  })
                }
              }}
            />
            <Button variant="contained" onClick={() => handleSubmit()} sx={{ width: '100%' }}>Finalizar</Button>
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

export default RegistrarIngrediente;