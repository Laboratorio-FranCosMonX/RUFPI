import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Card, CardContent, CardHeader, Checkbox, Container, Divider, FormControlLabel, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { userRegisterFormData, userRegisterSchema } from "../utils/schemas/UserRegisterSchema";

const Cadastro = () => {
  const navigate = useNavigate();
  const [tipoConta, setTipoConta] = useState<number>(-1);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control
  } = useForm<userRegisterFormData>({
    resolver: zodResolver(userRegisterSchema),
  })

  /**
   * A ser implementado:
   * - mostrar uma mensagem ao usuário impedindo que ele use qualquer comando enquanto a aplicação
   * esteja esperando a resposta.
   * 
   * @param data 
   */
  const onSubmit: SubmitHandler<userRegisterFormData> = async (data) => {
    console.log(data)

  }

  return (
    <Container sx={{ padding: 0, width: "100vw", minHeight: "100vh", display: 'flex', flexDirection: "column", justifyContent: "flex-start", alignItems: 'center' }}>
      <Box width="100%" display={"flex"} marginBottom={"20px"} justifyContent={'space-between'}>
        <Typography variant="h4">RUFPI</Typography>
      </Box>

      <Card variant="elevation" sx={{ width: { xs: '100%', sm: '75%', md: '50%', lg: '40%', xl: '30%' } }}>
        <CardHeader title={"Cadastro de usuário"} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent sx={{ display: 'flex', flexDirection: "column", gap: '15px' }}>
            <Box display={"flex"} justifyContent={"space-between"} alignItems={'center'}>
              <InputLabel id="tipoDeConta">Tipo de conta</InputLabel>
              <Controller
                name="tipo"
                control={control}
                defaultValue={-1} // Valor inicial
                render={({ field }) => (
                  <Select
                    {...field} // Vai integrar o campo do Select com o React Hook Form
                    labelId="tipoDeConta"
                    value={field.value !== -1 ? field.value : ''} // Valor controlado
                    onChange={(e) => {
                      field.onChange(Number(e.target.value)); // Atualiza o valor do formulário
                      setTipoConta(Number(e.target.value)); // Atualiza o estado do tipoConta
                    }}
                  >
                    <MenuItem value={0}>Discente</MenuItem>
                    <MenuItem value={1}>Administrador</MenuItem>
                  </Select>
                )}
              />
            </Box>
            {tipoConta != -1 &&
              <>
                <Divider />
                <TextField
                  label="CPF"
                  type="text"
                  variant="outlined"
                  {...register('cpf')}
                  error={!!errors.cpf}
                  helperText={errors.cpf?.message}
                  required
                  fullWidth
                />
                <TextField
                  label="Nome Completo"
                  type="text"
                  variant="outlined"
                  {...register('nome')}
                  error={!!errors.nome}
                  helperText={errors.nome?.message}
                  required
                  fullWidth
                />
                <TextField
                  label="Email"
                  type="email"
                  variant="outlined"
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  required
                  fullWidth
                />
                <TextField
                  label={tipoConta == 0 ? "matricula" : "Siape"}
                  type="text"
                  variant="outlined"
                  {...register('id')}
                  error={!!errors.id}
                  helperText={errors.id?.message}
                  required
                  fullWidth
                />
                <TextField
                  label="Senha"
                  type="password"
                  variant="outlined"
                  {...register('senha')}
                  error={!!errors.senha}
                  helperText={errors.senha?.message}
                  required
                  fullWidth
                />
                <TextField
                  label="Repetir senha"
                  type="password"
                  variant="outlined"
                  {...register('repetirSenha')}
                  error={!!errors.repetirSenha}
                  helperText={errors.repetirSenha?.message}
                  required
                  fullWidth
                />
                <FormControlLabel
                  control={<Checkbox {...register("nutricionista")} />}
                  label="Marque essa caixa se você for assumir o papel de nutricionista."
                />
                <Box display={'flex'} justifyContent={"space-between"}>
                  <Button variant="contained" onClick={() => {
                    navigate('/');
                  }}>Cancelar</Button>
                  <Button variant="contained" type="submit">Confirmar solicitação</Button>
                </Box>
              </>
            }
          </CardContent>
        </form>
      </Card>
    </Container>
  )
}

export default Cadastro