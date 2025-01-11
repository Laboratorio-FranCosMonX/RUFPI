import { Box, Container, Divider } from "@mui/material";
import MainMenu from "../components/MainMenu";
import Cardapio from "../menu/menu";

const Home = () => {
  return (
    <Container sx={{ padding: '0px', width: "100vw", maxWidth: '100vw', minHeight: "100vh", display: 'flex', flexDirection: "column", justifyContent: "flex-start", alignItems: 'center' }}>
      <MainMenu />
      <Divider sx={{
        fontSize: '5px',
        backgroundColor: 'black',
        marginBottom: '15px'
      }} />
      <Box sx={{ width: '100%' }} >
        <Cardapio />
      </Box>
    </Container>
  );
}

export default Home;