import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardContent, CardHeader, Divider, Grid2, Modal, TextField, Typography } from "@mui/material";
import moment from "moment";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import api from "../utils/api/api";
import { AtualizarEmailFormData, AtualizarEmailSchema } from "../utils/schemas/UpdateEmailSchema";

interface AtualizarSenhaParams {
  atualizarDados: () => void;
  fecharModal: () => void;
}

const AtualizarEmail = ({ fecharModal, atualizarDados, password, updateAt, id }: AtualizarSenhaParams & { password: String, updateAt: Date, id: string }) => {
  const [modalOpen, setModalOpen] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<AtualizarEmailFormData>({
    resolver: zodResolver(AtualizarEmailSchema),
  });

  const onSubmit: SubmitHandler<AtualizarEmailFormData> = async (data) => {
    if (password != data.senhaAntiga) {
      setError("senhaAntiga", {
        message: "A senha informada não condiz com a senha atual registrada em sua conta."
      })
      return;
    }

    const dados = {
      email: data.email
    }

    api.patch(`/usuario/${id}`, dados)
      .then(() => {
        console.log("Atualizado com sucesso")
        atualizarDados()
        fecharModal()
      })
      .catch((e) => {
        console.log("Erro ao atualizar senha")
        console.log(e)
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
            <Typography variant="body2">Prove que é você</Typography>
            <TextField
              label="Senha Atual"
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
              label="Novo Email"
              type="text"
              variant="outlined"
              fullWidth
              required
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <Grid2 display={"flex"} justifyContent={"right"}>
              <Button type="submit" variant="contained">Atualizar</Button>
            </Grid2>
          </CardContent>
        </Card>
      </form>
    </Modal >
  );
}

export default AtualizarEmail