import { Box, Button, Card, CardContent, CardHeader, Container, FormControl, Grid2, TextField, Typography } from "@mui/material";

export default function Login() {

  const handleSubmit = () => {

  }

  return (
    <Container sx={{ padding: 0, width: "100vw", height: "100vh", display: 'flex', flexDirection: "column", justifyContent: "flex-start", alignItems: 'center' }}>
      <Box width="100%" display={"flex"} marginBottom={"20px"} justifyContent={'space-between'}>
        <Typography variant="h4">RUFPI</Typography>
      </Box>
      <Card variant="elevation" sx={{ width: { xs: '100%', sm: '75%', md: '50%', lg: '40%', xl: '30%' } }}>
        <CardHeader title={"Login de usuário"}></CardHeader>
        <CardContent>
          <FormControl sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '15px'
          }}>
            <TextField
              name="usuario"
              id="usuario"
              label="Usuário"
              variant="outlined"
              fullWidth
            />
            <TextField
              name="senha"
              id="senha"
              label="Senha"
              variant="outlined"
              fullWidth
            />

            <Grid2 width="100%" display="flex" justifyContent="space-between">
              <Button>Cadastrar-se</Button>
              <Button type="submit" variant="contained">
                Entrar
              </Button>
            </Grid2>
          </FormControl>
        </CardContent>
      </Card>

    </Container>
  );
}