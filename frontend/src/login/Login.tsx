import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Card, CardContent, CardHeader, Container, Grid2, TextField, Typography } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import api from "../utils/api/api";
import { LoginFormData, LoginSchema } from "../utils/schemas/LoginSchema";

export default function Login() {
  const navigate = useNavigate()


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
    await api
      .get(`/usuario/${data.id}`)
      .then(() => {
        alert("Login efetuado com sucesso")
        setTimeout(() => {//ir para a tela de login
          navigate('/home')
        }, 1000);
      })
      .catch((erro) => {
        console.log(erro)
        console.log("falha ao registrar usuario")
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
              id={"id"}
              label="Informe o número de matricula ou SIAPI."
              type={"text"}
              variant="outlined"
              {...register("id")}
              error={!!errors.id}
              helperText={errors.id?.message}
              required
              fullWidth
            />
            <TextField
              id="senha"
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

    </Container >
  );
}