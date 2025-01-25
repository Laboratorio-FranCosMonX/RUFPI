import { Avatar, Box, Button, Container, Divider, Grid2, LinearProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import MainMenu from "../components/MainMenu";
import api from "../utils/api/api";
import AdicionarFichas from "./AddChips";
import AtualizarEmail from "./UpdateEmail";
import AtualizarSenha from "./UpdatePassword";
import AtualizarPerfil from "./UpdateProfile";

interface Tipo {
  id: number
  nome: string
  descricao: string
}

interface Usuario {
  nome: string
  id: number
  email: string
  matricula_siapi: number
  tipo: Tipo
  nutricionista: boolean
  fichas: number
}

interface ModalInterface {
  dadosDoUsuario: boolean
  email: boolean
  senha: boolean
  comprarFicha: boolean
}

const Perfil = () => {

  const [profile, setProfile] = useState<Usuario>({
    email: '', id: -1, matricula_siapi: -1, nome: '', nutricionista: false, tipo: { id: -1, descricao: '', nome: '' }, fichas: 0
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
    await api.get(`/usuarios/${api.defaults.data.user.id}`)
      .then((response) => {
        setProfile(response.data)
        //console.log(response.data.tipo)
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

    if (modal.comprarFicha)
      return (
        <AdicionarFichas
          fecharModal={callbackCloseModal}
          atualizarDados={callbackModalOK}
          id={profile.id}
        />
      )

    return (
      <AtualizarSenha fecharModal={callbackCloseModal} updateAt={new Date(Date.now())} id={profile.id} />
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
          marginTop: '70px'
        }}>
          <LinearProgress />
          <Typography>Carregando</Typography>
        </Box>

        ||

        !!dadosCarregados && profile !== undefined &&
        <Box width={"100%"} maxWidth={'1000px'} paddingTop={3} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} marginTop={'70px'}>
          <Grid2 display={"flex"} justifyContent={'space-between'} width={'70%'} border={"1px solid gray"} borderRadius={'19px'}>
            <Box display="flex" flexDirection={"column"} gap={1} margin={2} width={'100%'} position={"relative"}>
              <Typography variant="h5" >{profile.nome}</Typography>
              <Typography variant="body1" >{profile.tipo.nome}: {profile.matricula_siapi}</Typography>
              <Typography variant="body1" >Email: {profile.email}</Typography>
              <Typography variant="body1" >Fichas: {profile.fichas}</Typography>
              <Box position={'absolute'} margin={'auto'} zIndex={-1} width={'100%'} height={'100%'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                <img className="image-paper-profile" src="papelDeParedePerfilUsuario.jpg" alt="" />
              </Box>
            </Box>
            <Box display={'flex'} justifyContent={'center'} alignItems={'center'} maxWidth={"140px"}>
              <Avatar src="imageProfile.jpg" sx={{ maxWidth: '100%', height: 'auto', width: '100%' }} />
            </Box>
          </Grid2>
          <Box display={"flex"} justifyContent={"center"} alignItems={'center'} flexWrap={"wrap"} width={'100%'} marginTop={3} gap={'10px'}>
            <Button sx={{ width: '180px' }} variant="contained" onClick={() => {
              setModal({
                ...modal,
                dadosDoUsuario: true
              })
            }}>Editar Perfil</Button>
            <Button sx={{ width: '180px' }} variant="outlined" onClick={() => {
              setModal({
                ...modal,
                email: true
              })
            }}>Atualizar Email</Button>
            <Button sx={{ width: '180px' }} variant="outlined" onClick={() => {
              setModal({
                ...modal,
                senha: true
              })

            }}>Atualizar Senha</Button>
            <Button sx={{ width: '180px' }} variant="contained" onClick={() => {
              setModal({
                ...modal,
                comprarFicha: true
              })
            }}>Comprar Fichas</Button>
          </Box>
        </Box>
      }
      {handleModal()}
    </Container>
  );
}

export default Perfil;