import { AlertColor, Box, Button, Card, CardContent, CardHeader, Modal, TextField, Tooltip } from "@mui/material";
import { FormEvent, useState } from "react";
import AlertSnackBar from "../components/InformSystem";
import api from "../utils/api/api";

interface AtualizarSenhaParams {
  atualizarDados: () => void;
  fecharModal: () => void;
}

const AdicionarFichas = ({ fecharModal, atualizarDados, id }: AtualizarSenhaParams & { id: number }) => {
  const [modalOpen, setModalOpen] = useState(true)
  const [messageSystem, setMessageSystem] = useState<{ visivel: boolean, message: string, color: AlertColor, duracao: number }>({
    message: '', color: 'info', duracao: 4, visivel: false
  })
  const [qtdFichas, setQtdFichas] = useState(0)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (qtdFichas === 0) {
      setMessageSystem({
        message: "Coloque um valor válido a ser comprado.",
        color: 'error',
        duracao: 4,
        visivel: true
      })

      setTimeout(() => {
        setMessageSystem({
          ...messageSystem,
          visivel: true
        })
      }, 4000)
      return;
    }

    api.post("/usuario/add_fichas", { "id": id, "fichas": qtdFichas })
      .then(() => {
        setMessageSystem({
          message: "Compra efetuada com sucesso.",
          color: 'success',
          duracao: 4,
          visivel: true
        })

        setTimeout(() => {
          setMessageSystem({
            ...messageSystem,
            visivel: true
          })
          atualizarDados()
          fecharModal()
        }, 4000)
      })
      .catch(() => {
        setMessageSystem({
          message: "Houve problemas ao comprar fichas.",
          color: 'error',
          duracao: 4,
          visivel: true
        })

        setTimeout(() => {
          setMessageSystem({
            ...messageSystem,
            visivel: true
          })
        }, 4000)
      })
  }

  return (
    <Modal
      open={modalOpen}
      onClose={() => {
        fecharModal()
        setModalOpen(false)
      }}
      sx={{
        display: "flex",
        justifyContent: "center",
        height: "maxContent",
        alignItems: "center"
      }}
    >
      <form onSubmit={handleSubmit} className="global-form">
        <Button
          onClick={fecharModal}
          sx={{
            backgroundColor: 'red',
            color: "white",
            top: '10px',
            right: '0px',
            display: 'absolute',
            padding: '0px',
          }}
          variant="contained">X</Button>
        <Card sx={{
          backgroundColor: "White",
          width: { xs: '100%', sm: '80%', md: '80%', lg: '90%', xl: '90%' }
        }}>
          <CardHeader title="Adicionar fichas" />
          <CardContent
            sx={{
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              gap: "12px"
            }}
          >
            <Box display={"flex"} gap={'10px'} >
              <Tooltip title="Remover fichas">
                <Button aria-description="add" sx={{ fontSize: '30px', padding: '0' }}
                  onClick={() => {
                    if (qtdFichas - 1 >= 0)
                      setQtdFichas(qtdFichas - 1)
                  }}>-</Button>
              </Tooltip>
              <TextField
                label="Fichas"
                type="number"
                variant="outlined"
                fullWidth
                required
                value={qtdFichas}
                onChange={(e) => {
                  if (parseInt(e.target.value) < 0)
                    setQtdFichas(0)
                }}
              />
              <Tooltip title="Add fichas">
                <Button aria-description="add" sx={{ fontSize: '30px', padding: '0' }}
                  onClick={() => {
                    setQtdFichas(qtdFichas + 1)
                  }}>+</Button>
              </Tooltip>
            </Box>
            <Button type={"submit"} variant="contained" sx={{ width: '100%' }}>Comprar</Button>
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
    </Modal >
  );
}

export default AdicionarFichas