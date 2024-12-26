import { Container, Divider } from "@mui/material";
import MainMenu from "../components/MainMenu";

const Home = () => {
  return (
    <Container sx={{ padding: '0px', width: "100vw", minHeight: "100vh", display: 'flex', flexDirection: "column", justifyContent: "flex-start", alignItems: 'center' }}>
      <MainMenu />
      <Divider sx={{
        fontSize: '5px',
        backgroundColor: 'black'
      }} />
    </Container>
  );
}

export default Home;