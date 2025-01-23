import { zodResolver } from "@hookform/resolvers/zod";
import { AlertColor, Button, Card, CardContent, CardHeader, Checkbox, FormControlLabel, Grid2, Modal, TextField, Typography } from "@mui/material";
import moment from "moment";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import AlertSnackBar from "../components/InformSystem";
import api from "../utils/api/api";
import { AtualizarPerfilFormData, AtualizarPerfilSchema } from "../utils/schemas/UpdateProfile";

interface AtualizarPerfilParams {
  atualizarDados: () => void;
  fecharModal: () => void;
}

/**
 * 
 * @param param0 
 * @returns 
 */
const AtualizarPerfil = ({ atualizarDados, fecharModal, updateAt, eNutricionista, id }: AtualizarPerfilParams & { updateAt: Date, eNutricionista: boolean, id: number }) => {
  const [modalOpen, setModalOpen] = useState(true)
  const [messageSystem, setMessageSystem] = useState<{ visivel: boolean, message: string, color: AlertColor, duracao: number }>({
    message: '', color: 'info', duracao: 4, visivel: false
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<AtualizarPerfilFormData>({
    resolver: zodResolver(AtualizarPerfilSchema),
  });

  const onSubmit: SubmitHandler<AtualizarPerfilFormData> = async (data) => {
    if (!data.nome && !data.nutricionista) {
      setError("nome", {
        message: "É necessário que seja informado alguma mudança para atualizar os dados"
      })
      setError("nutricionista", {
        message: "É necessário que seja informado alguma mudança para atualizar os dados"
      })
      return;
    }
    let dado;
    if (!!data.nome && !!data.nutricionista) {
      dado = { nome: data.nome, is_nutricionista: data.nutricionista }
    } else if (!!data.nome) {
      dado = { nome: data.nome }
    } else {
      dado = { is_nutricionista: data.nutricionista }
    }
    api.patch(`/usuarios/${id}/perfil`, dado)
      .then(() => {
        setMessageSystem({
          color: 'success',
          message: "Dados atualizados com sucesso.",
          duracao: 4,
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
      })
      .catch(() => {
        setMessageSystem({
          color: 'error',
          message: "Problema ao atualizar os dados. Veja se os dados nos campos estão corretos.",
          duracao: 4,
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
      <form onSubmit={handleSubmit(onSubmit)} className="global-form">
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
          <CardHeader title="Alterar email" subheader={`Atualizado em ${moment(updateAt.getTime()).format('DD/MM/YYYY HH:MM:SS')}`} />
          <CardContent
            sx={{
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              gap: "12px"
            }}
          >
            <Typography variant="body2">Para atualizar os dados é necessário que preencha um ou mais campos.</Typography>
            <TextField
              label="Nome"
              type="text"
              variant="outlined"
              fullWidth
              {...register("nome")}
              error={!!errors.nome}
              helperText={errors.nome?.message}
            />
            <FormControlLabel
              control={<Checkbox {...register("nutricionista")} />}
              label={eNutricionista ? "Desmarque essa caixa caso esteja desistindo do cargo de nutricionista." : "Marque essa caixa se você for assumir o papel de nutricionista."}
            />
            <Grid2 display={"flex"} justifyContent={"right"}>
              <Button type="submit" variant="contained">Atualizar</Button>
            </Grid2>
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

export default AtualizarPerfil