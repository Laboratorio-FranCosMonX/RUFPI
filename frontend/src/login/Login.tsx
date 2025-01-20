import { zodResolver } from "@hookform/resolvers/zod";
import { AlertColor, Box, Button, Card, CardContent, CardHeader, Container, Grid2, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import AlertSnackBar from "../components/InformSystem";
import api from "../utils/api/api";
import { LoginFormData, LoginSchema } from "../utils/schemas/LoginSchema";

export default function Login() {
  const navigate = useNavigate()
  const [processando, setProcessando] = useState(false)
  const [messageSystem, setMessageSystem] = useState<{ message: string, color: AlertColor, duracao: number }>({
    message: '', color: 'info', duracao: 4
  })

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  })

  /**
   * A ser implementado:
   * - mostrar uma mensagem ao usuário impedindo que ele use qualquer comando enquanto a aplicação
   * esteja esperando a resposta.
   * - nessa aplicação, a autenticação do usuário não será o foco.
   * @param data 
   */
  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setProcessando(true)
    await api
      .post(`/login`, {
        email: data.email,
        senha: data.senha
      })
      .then((response) => {
        api.defaults.data = {//salvando alguns dados
          user: {
            id: response.data.id,
            nome: response.data.nome
          }
        }
        setMessageSystem({
          ...messageSystem,
          message: ("Login efetuado com sucesso!"),
          color: 'success'
        })
        setTimeout(() => {//ir para a tela de login
          setMessageSystem({
            ...messageSystem,
            message: '',
            color: 'info'
          })
          navigate('/home')
        }, 2000);
      })
      .catch((error) => {
        setMessageSystem({
          ...messageSystem,
          message: ("Houve um problema ao fazer o Login: " + error.response.data.error),
          color: 'error'
        })
        setTimeout(() => {
          setMessageSystem({
            ...messageSystem,
            message: '',
            color: 'info'
          })
          setProcessando(false)
        }, 4000)
      })
  }

  return (
    <Container sx={{ padding: 0, width: "100vw", height: "100vh", display: 'flex', flexDirection: "column", justifyContent: "flex-start", alignItems: 'center' }}>
      <Box width="100%" display={"flex"} marginBottom={"20px"} justifyContent={'space-between'}>
        <Typography variant="h4">RUFPI</Typography>
      </Box>

      <Card variant="elevation" sx={{ width: { xs: '100%', sm: '75%', md: '50%', lg: '40%', xl: '30%' } }}>
        <CardHeader title={"Login de usuário"} subheader="Conta do administrador ou do aluno com cadastro confirmado na plataforma." />
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '15px'
          }}>
            <TextField
              label="Informe o email cadastrado."
              type={"email"}
              variant="outlined"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              required
              fullWidth
            />
            <TextField
              label="Senha"
              type={"password"}
              variant="outlined"
              {...register("senha")}
              error={!!errors.senha}
              helperText={errors.senha?.message}
              required
              fullWidth
            />
            <Grid2 width="100%" display="flex" justifyContent="space-between">
              <Button onClick={() => {
                navigate("/register")
              }}>Cadastrar-se</Button>
              <Button type="submit" variant="contained">
                Entrar
              </Button>
            </Grid2>
          </CardContent>
        </form>
      </Card>
      {
        processando &&
        <AlertSnackBar
          message={messageSystem.message}
          severityMessage={messageSystem.color}
          alignHorizontal="center"
          alignVertical="top"
          duracao={messageSystem.duracao}
        />
      }
    </Container >
  );
}