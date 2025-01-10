import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardContent, CardHeader, Divider, Grid2, Modal, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import api from "../utils/api/api";
import { AtualizarSenhaFormData, AtualizarSenhaSchema } from "../utils/schemas/UpdatePasswordSchema";

interface AtualizarSenhaParams {
  atualizarDados: () => void;
  fecharModal: () => void;
}

const AtualizarSenha = ({ fecharModal, password, updateAt, id }: AtualizarSenhaParams & { password: String, updateAt: string, id: string }) => {
  const [modalOpen, setModalOpen] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<AtualizarSenhaFormData>({
    resolver: zodResolver(AtualizarSenhaSchema),
  });

  const onSubmit: SubmitHandler<AtualizarSenhaFormData> = async (data) => {
    if (password != data.senhaAntiga) {
      setError("senhaAntiga", {
        message: "A senha informada não condiz com a senha atual registrada em sua conta."
      })
      return;
    }

    const dados = {
      senha: data.senha
    }
    api.patch(`/usuario/${id}`, dados)
      .then(() => {
        console.log("Atualizado com sucesso")
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
        <Card sx={{
          backgroundColor: "White",
          width: { xs: '100%', sm: '75%', md: '50%', lg: '40%', xl: '30%' }
        }}>
          <CardHeader title="Alterar Senha" subheader={`Atualizado em ${updateAt}`} />
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
      </form>
    </Modal >
  );
}

export default AtualizarSenha