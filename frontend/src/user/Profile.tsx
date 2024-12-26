import { Box, Button, Container, Divider, Grid2, Typography } from "@mui/material";
import { useState } from "react";
import MainMenu from "../components/MainMenu";

interface Usuario {
  nome: string
  id: number
  email: string
  tipo: 'administrador' | 'discente'
  qtdFichas: number
}

const Perfil = () => {

  const [profile, setProfile] = useState<Usuario>({
    nome: "fulano de tal", id: 22555255555, email: 'fulano@gmail.com', tipo: "discente", qtdFichas: 5
  })

  const handleProfileData = async () => {

  }

  return (
    <Container sx={{ padding: '0px', width: "100vw", minHeight: "100vh", display: 'flex', flexDirection: "column", justifyContent: "flex-start", alignItems: 'center' }}>
      <MainMenu />
      <Divider sx={{
        fontSize: '5px',
        backgroundColor: 'black'
      }} />
      <Box width={"100%"} paddingTop={3} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
        <Grid2 display={"flex"} justifyContent={'space-between'} width={'70%'} border={"1px solid gray"} borderRadius={'19px'} >
          <Box display="flex" flexDirection={"column"} gap={1} margin={2} width={'50%'} position={"relative"}>
            <Typography variant="h5">{profile.nome}</Typography>
            <Typography variant="body1">Matricula: {profile.id}</Typography>
            <Typography variant="body1">Email: {profile.email}</Typography>
            <Typography variant="body1">Fichas: {profile.qtdFichas}</Typography>
            <img className="image-paper-profile" src="papelDeParedePerfilUsuario.jpg" alt="" />
          </Box>
          <Box>
            <img className="image-profile" src="imageProfile.jpg" alt="" />
          </Box>
        </Grid2>
        <Box display={"flex"} justifyContent={"space-evenly"} width={'100%'} marginTop={3}>
          <Button variant="contained">Editar Perfil</Button>
          <Button variant="outlined">Atualizar Email</Button>
          <Button variant="outlined">Atualizar Senha</Button>
          <Button variant="contained">Comprar Fichas</Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Perfil;