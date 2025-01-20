import { Alert, AlertColor, Box, Snackbar } from "@mui/material";
import React, { useState } from 'react';

interface AlertParams {
  message: string;
  severityMessage: AlertColor;
  alignVertical?: "bottom" | "top";
  alignHorizontal?: "left" | "center" | "right";
  duracao?: number
}

/**
 * 
 * @param message informação a ser passada ao usuário
 * @param severityMessage tipo de mensagem que será passada. ex: erro, sucess
 * @param alignVertical localização da janela informativa na vertical
 * @param alignHorizontal localização da janela informativa na Horizontal
 * @param duracao Duração (Em segundos) que a mensagem permanecerá na tela
 * @returns
 */
const AlertSnackBar: React.FC<AlertParams> = ({ message, severityMessage, alignVertical, alignHorizontal, duracao }) => {
  if (alignVertical === undefined)
    alignVertical = 'top';
  if (alignHorizontal === undefined)
    alignHorizontal = 'center';

  const [open, setOpen] = useState(true);

  //@ts-ignore ignorando warning de variavel não sendo usada
  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <Box padding={'20px'}>
      <Snackbar
        open={open}
        autoHideDuration={duracao == undefined ? 4 * 1000 : duracao * 1000}
        onClose={handleClose}
        anchorOrigin={{
          vertical: alignVertical,
          horizontal: alignHorizontal,
        }}
      >
        <Alert variant="filled" severity={severityMessage} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AlertSnackBar;