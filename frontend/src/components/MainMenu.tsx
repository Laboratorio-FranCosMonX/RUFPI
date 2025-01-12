import { Avatar, Box, Button, Divider, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api/api";

const MainMenu = () => {
  const navigate = useNavigate();

  const [inicializando, setInicializando] = useState(false)
  const [inicial, setInicial] = useState("")
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (!inicializando) {
      setTimeout(() => {
        setInicializando(true);
        try {
          setInicial(api.defaults.data.user.nome[0])
        } catch (e) {
          alert("Houve um problema ao carregar os dados, contate o desenvolvedor para corrigir o problema.")
          api.defaults.data = null
          navigate("/")
        }
      }, 200)
    }
  }, [inicializando])

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', paddingTop: '7px', width: "100%", maxWidth: '100vw', justifyContent: 'space-between', alignItems: 'center', textAlign: 'center', borderBottom: '1px solid gray' }}>
        <Button variant="text" size={"large"} sx={{
          ':hover': {
            backgroundColor: 'none'
          },
          color: 'black',
          fontSize: '25px',
          padding: '0px',
          paddingLeft: '7px',
          paddingRight: '7px'
        }} onClick={() => {
          navigate("/home")
        }}>RUFPI</Button>
        <Tooltip title="Configurações da conta">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }}>{inicial}</Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => {
          navigate('/profile')
        }}>
          <Avatar /> Perfil
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Avatar /> Minha Conta
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => {
          navigate('/')
        }}>
          Sair
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}

export default MainMenu