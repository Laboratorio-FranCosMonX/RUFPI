import { Box, Button, Card, CardContent, CardHeader, Container, Divider, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import { useState } from "react";

const Cadastro = () => {

  const [tipoConta, setTipoConta] = useState<number>(-1);

  const handleSelectChange = (event: SelectChangeEvent) => {
    setTipoConta(parseInt(event.target.value));
  }

  return (
    <Container sx={{ padding: 0, width: "100vw", minHeight: "100vh", display: 'flex', flexDirection: "column", justifyContent: "flex-start", alignItems: 'center' }}>
      <Box width="100%" display={"flex"} marginBottom={"20px"} justifyContent={'space-between'}>
        <Typography variant="h4">RUFPI</Typography>
      </Box>

      <Card variant="elevation" sx={{ width: { xs: '100%', sm: '75%', md: '50%', lg: '40%', xl: '30%' } }}>
        <CardHeader title={"Cadastro de usuário"} />
        <form>
          <CardContent sx={{ display: 'flex', flexDirection: "column", gap: '7px' }}>
            <Box display={"flex"} justifyContent={"space-between"} alignItems={'center'}>

              <InputLabel id="tipoDeConta">Tipo de conta</InputLabel>
              <Select
                labelId="tipoDeConta"
                onChange={handleSelectChange}
              >
                <MenuItem value={0}>Discente</MenuItem>
                <MenuItem value={1}>Administrador</MenuItem>
              </Select>
            </Box>
            {tipoConta != -1 &&
              <>
                <Divider />
                <TextField
                  label="CPF"
                  type="text"
                  variant="outlined"
                  required
                  fullWidth
                />
                <TextField
                  label="Nome Completo"
                  type="text"
                  variant="outlined"
                  required
                  fullWidth
                />
                <TextField
                  label="Email"
                  type="email"
                  variant="outlined"
                  required
                  fullWidth
                />
                <TextField
                  label={tipoConta == 0 ? "matricula" : "Siape"}
                  type="number"
                  variant="outlined"
                  required
                  fullWidth
                />
                <TextField
                  label="Senha"
                  type="password"
                  variant="outlined"
                  required
                  fullWidth
                />
                <TextField
                  label="Repetir senha"
                  type="password"
                  variant="outlined"
                  required
                  fullWidth
                />
                <Box display={'flex'} justifyContent={"space-between"}>
                  <Button variant="contained">Cancelar</Button>
                  <Button variant="contained">Confirmar solicitação</Button>
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