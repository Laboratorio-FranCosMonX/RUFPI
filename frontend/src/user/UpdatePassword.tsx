import { zodResolver } from "@hookform/resolvers/zod";
import { AlertColor, Button, Card, CardContent, CardHeader, Divider, Grid2, Modal, TextField, Typography } from "@mui/material";
import moment from "moment";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import AlertSnackBar from "../components/InformSystem";
import api from "../utils/api/api";
import { AtualizarSenhaFormData, AtualizarSenhaSchema } from "../utils/schemas/UpdatePasswordSchema";

interface AtualizarSenhaParams {
  fecharModal: () => void;
}

const AtualizarSenha = ({ fecharModal, updateAt, id }: AtualizarSenhaParams & { updateAt: Date, id: number }) => {
  const [modalOpen, setModalOpen] = useState(true)
  const [messageSystem, setMessageSystem] = useState<{ visivel: boolean, message: string, color: AlertColor, duracao: number }>({
    message: '', color: 'info', duracao: 4, visivel: false
  })

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<AtualizarSenhaFormData>({
    resolver: zodResolver(AtualizarSenhaSchema),
  });

  const onSubmit: SubmitHandler<AtualizarSenhaFormData> = async (data) => {
    const dados = {
      senha_atual: data.senhaAntiga,
      nova_senha: data.senha
    }
    api.patch(`/usuarios/${id}/password`, dados)
      .then(() => {
        setMessageSystem({
          color: 'success',
          duracao: 4,
          message: 'Senha atualizado com êxito',
          visivel: true
        })
        setTimeout(() => {
          setMessageSystem({
            ...messageSystem,
            visivel: false
          })
          fecharModal()
        }, 4000)
      })
      .catch((e) => {
        setMessageSystem({
          color: 'error',
          duracao: 4,
          message: `Houve um problema ao atualizar a senha: ${e.response.data.error}.`,
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
          <CardHeader title="Alterar Senha" subheader={`Atualizado em ${moment(updateAt.getTime()).format('DD/MM/YYYY HH:MM:SS')}`} />
          <CardContent
            sx={{
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              gap: "12px"
            }}
          >
            <Typography variant="body2">Prove que é você</Typography>
            <TextField
              label="Senha"
              type="password"
              variant="outlined"
              fullWidth
              required
              {...register("senhaAntiga")}
              error={!!errors.senhaAntiga}
              helperText={errors.senhaAntiga?.message}
            />
            <Divider />
            Informação a ser atualizada.
            <TextField
              label="Nova Senha"
              type="password"
              variant="outlined"
              fullWidth
              required
              {...register("senha")}
              error={!!errors.senha}
              helperText={errors.senha?.message}
            />
            <TextField
              label="Repetir senha"
              type="password"
              variant="outlined"
              fullWidth
              required
              {...register("repetirSenha")}
              error={!!errors.repetirSenha}
              helperText={errors.repetirSenha?.message}
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
    </Modal >
  );
}

export default AtualizarSenha