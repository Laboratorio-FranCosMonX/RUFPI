import { Box, Button, Container, Divider, Grid2, LinearProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import MainMenu from "../components/MainMenu";
import api from "../utils/api/api";
import AtualizarEmail from "./UpdateEmail";
import AtualizarSenha from "./UpdatePassword";
import AtualizarPerfil from "./UpdateProfile";

interface Usuario {
  nome: string
  id: string
  email: string
  tipo: number
  nutricionista: boolean
}

interface ModalInterface {
  dadosDoUsuario: boolean
  email: boolean
  senha: boolean
  comprarFicha: boolean
}

const Perfil = () => {

  const [profile, setProfile] = useState<Usuario>({
    email: '', id: '', nome: '', tipo: -1, nutricionista: false
  })
  const [profileInicializado, setProfileInicializado] = useState(false)
  const [dadosCarregados, setDadosCarregados] = useState(false)
  const [modal, setModal] = useState<ModalInterface>({ comprarFicha: false, dadosDoUsuario: false, email: false, senha: false })

  useEffect(() => {
    if (!profileInicializado) {
      setTimeout(() => {
        setProfileInicializado(true);
        handleProfileData();
      }, 200);
    }
  }, [profileInicializado])

  const handleProfileData = async () => {
    await api.get(`/usuario/${api.defaults.data.user.id}`)
      .then((response) => {
        setProfile(response.data)
        if (profile !== undefined) setDadosCarregados(true)
      })
      .catch((e) => {
        console.error(e)
      })
  }

  const callbackCloseModal = () => {
    setModal({
      comprarFicha: false,
      dadosDoUsuario: false,
      email: false,
      senha: false
    })
  }

  const callbackModalOK = () => {
    handleProfileData();
  }

  const handleModal = () => {
    if (!modal.comprarFicha && !modal.dadosDoUsuario && !modal.email && !modal.senha)
      return false;

    if (modal.email)
      return (
        <AtualizarEmail
          fecharModal={callbackCloseModal}
          atualizarDados={callbackModalOK}
          updateAt={new Date(Date.now())}
          id={profile.id}
          password={"teste"}
        />
      )

    if (modal.dadosDoUsuario)
      return (
        <AtualizarPerfil
          fecharModal={callbackCloseModal}
          atualizarDados={callbackModalOK}
          updateAt={new Date(Date.now())}
          eNutricionista={profile.nutricionista}
          id={profile.id}
        />
      )
    return (
      <AtualizarSenha fecharModal={callbackCloseModal} updateAt={new Date(Date.now())} password={"teste"} id={profile.id} />
    )
  }

  return (
    <Container sx={{ padding: '0px', width: "100vw", minHeight: "100vh", display: 'flex', flexDirection: "column", justifyContent: "flex-start", alignItems: 'center' }}>
      <MainMenu />
      <Divider sx={{
        fontSize: '5px',
        backgroundColor: 'black'
      }} />
      {
        !dadosCarregados &&
        <Box sx={{
          marginTop: '20px'
        }}>
          <LinearProgress />
          <Typography>Carregando</Typography>
        </Box>

        ||

        !!dadosCarregados && profile !== undefined &&
        <Box width={"100%"} paddingTop={3} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
          <Grid2 display={"flex"} justifyContent={'space-between'} width={'70%'} border={"1px solid gray"} borderRadius={'19px'} >
            <Box display="flex" flexDirection={"column"} gap={1} margin={2} width={'50%'} position={"relative"}>
              <Typography variant="h5">{profile.nome}</Typography>
              <Typography variant="body1">Matricula: {profile.id}</Typography>
              <Typography variant="body1">Email: {profile.email}</Typography>
              <Typography variant="body1">Fichas: 1</Typography>
              <img className="image-paper-profile" src="papelDeParedePerfilUsuario.jpg" alt="" />
            </Box>
            <Box>
              <img className="image-profile" src="imageProfile.jpg" alt="" />
            </Box>
          </Grid2>
          <Box display={"flex"} justifyContent={"space-evenly"} width={'100%'} marginTop={3}>
            <Button variant="contained" onClick={() => {
              setModal({
                ...modal,
                dadosDoUsuario: true
              })
            }}>Editar Perfil</Button>
            <Button variant="outlined" onClick={() => {
              setModal({
                ...modal,
                email: true
              })
            }}>Atualizar Email</Button>
            <Button variant="outlined" onClick={() => {
              setModal({
                ...modal,
                senha: true
              })

            }}>Atualizar Senha</Button>
            <Button variant="contained">Comprar Fichas</Button>
          </Box>
        </Box>
      }
      {handleModal()}
    </Container>
  );
}

export default Perfil;