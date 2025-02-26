import { zodResolver } from "@hookform/resolvers/zod";
import { AlertColor, Box, Button, Card, CardContent, CardHeader, Checkbox, Container, Divider, FormControlLabel, InputLabel, LinearProgress, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import AlertSnackBar from "../components/InformSystem";
import api from "../utils/api/api";
import { userRegisterFormData, userRegisterSchema } from "../utils/schemas/UserRegisterSchema";

const Cadastro = () => {
  const navigate = useNavigate();
  const [tipoConta, setTipoConta] = useState<number>(-1);
  const [messageSystem, setMessageSystem] = useState<{ message: string, color: AlertColor }>({
    message: '', color: 'info'
  })
  const [processando, setProcessando] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    control
  } = useForm<userRegisterFormData>({
    resolver: zodResolver(userRegisterSchema),
  })

  const handleCreateTipo = async (tipo: string, descricao: string): Promise<number> => {
    let tipoEncontrado = false

    let contador_para_parar = 0;
    let id_Tipo: number = -1;
    while (!tipoEncontrado) {
      id_Tipo = await api.get(`/tipos/nome/${tipo}`)
        .then((response) => {
          tipoEncontrado = true;
          return response.data.id;
        })
        .catch(async (err) => {
          console.log(err)
          await api.post("/tipos/create", {
            nome: tipo,
            descricao: descricao
          })
            .then((res) => {
              console.log("criado com sucesso" + res)
            })
          return -1;
        })

      contador_para_parar++;
      if (contador_para_parar > 5) {
        return -1
      }
    }
    return id_Tipo
  }

  /**
   * A ser implementado:
   * - mostrar uma mensagem ao usuário impedindo que ele use qualquer comando enquanto a aplicação
   * esteja esperando a resposta.
   * 
   * @param data 
   */
  const onSubmit: SubmitHandler<userRegisterFormData> = async (data) => {
    // console.log(data)
    setProcessando(true)
    const tipo_da_conta: string = tipoConta === 1 ? "administrativo" : "comum";

    await handleCreateTipo(
      tipo_da_conta === "administrativo" ? "administrador" : "comum",
      tipo_da_conta === "administrativo" ? "Acesso a todas as funcionalidades do sistema" :
        "Apenas visualizar cardapios e alterar informações do perfil"
    ).then(async (tipo_id) => {
      // console.log(tipo_id)
      await api.post("/usuarios/create", {
        nome: data.nome,
        email: data.email,
        cpf: data.cpf,
        matricula_siapi: data.id,
        tipo_id: tipo_id,
        is_nutricionista: data.nutricionista,
        senha: data.senha
      }).then(() => {
        setMessageSystem({
          color: 'success',
          message: 'Usuário cadastrado com sucesso!'
        })
        setTimeout(() => {
          setMessageSystem({
            color: 'info',
            message: ''
          })
          navigate('/')
          setProcessando(false)
        }, 4000)
      })
        .catch((e) => {
          console.error(e)
          setMessageSystem({
            color: 'error',
            message: ("Sistema informa: " + e.response.data.error)
          })
          setTimeout(() => {
            setMessageSystem({
              color: 'info',
              message: ''
            })
            setProcessando(false)
          }, 4000)
        })
    })
      .catch((e) => {
        // console.error(e)
        setMessageSystem({
          color: 'error',
          message: ("Houve um problema ao cadastrar o usuário.\nSISTEMA INFORMA: " + e.response.data.error)
        })
        setTimeout(() => {
          setMessageSystem({
            color: 'info',
            message: ''
          })
          setProcessando(false)
        }, 2000)
      })

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
                  type="number"
                  variant="outlined"
                  {...register('cpf', { valueAsNumber: true })}
                  error={!!errors.cpf}
                  helperText={errors.cpf?.message}
                  fullWidth
                />
                <TextField
                  label="Nome Completo"
                  type="text"
                  variant="outlined"
                  {...register('nome')}
                  error={!!errors.nome}
                  helperText={errors.nome?.message}
                  fullWidth
                />
                <TextField
                  label="Email"
                  type="email"
                  variant="outlined"
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  fullWidth
                />
                <TextField
                  label={tipoConta == 0 ? "matricula" : "Siape"}
                  type="number"
                  variant="outlined"
                  {...register('id', { valueAsNumber: true })}
                  error={!!errors.id}
                  helperText={errors.id?.message}
                  fullWidth
                />
                <TextField
                  label="Senha"
                  type="password"
                  variant="outlined"
                  {...register('senha')}
                  error={!!errors.senha}
                  helperText={errors.senha?.message}
                  fullWidth
                />
                <TextField
                  label="Repetir senha"
                  type="password"
                  variant="outlined"
                  {...register('repetirSenha')}
                  error={!!errors.repetirSenha}
                  helperText={errors.repetirSenha?.message}
                  fullWidth
                />
                <FormControlLabel
                  control={<Checkbox {...register("nutricionista")} />}
                  label="Marque essa caixa se você for assumir o papel de nutricionista."
                />
                <Box display={'flex'} justifyContent={"space-between"}>
                  {processando && <LinearProgress />}
                  {
                    !processando &&
                    <>
                      <Button variant="contained" onClick={() => { navigate('/'); }}>Cancelar</Button>
                      <Button variant="contained" type="submit">Confirmar solicitação</Button>
                    </>
                  }
                </Box>
              </>
            }
          </CardContent>
        </form>
      </Card>
      {
        processando &&
        <AlertSnackBar
          message={messageSystem.message}
          severityMessage={messageSystem.color}
          alignHorizontal="left"
          alignVertical="top"
          duracao={8}
        />
      }
    </Container>
  )
}

export default Cadastro