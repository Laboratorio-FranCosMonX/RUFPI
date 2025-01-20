import { Modal, Typography } from "@mui/material";
import { useState } from "react";

interface CadastrarPratoParams {
  fecharModal: () => void;
}

const RegistrarPrato = ({ fecharModal }: CadastrarPratoParams) => {
  const [modalPratoOpen, setModalPratoOpen] = useState(true)

  const handleSubmit = () => {

  }

  return (
    <Modal
      open={modalPratoOpen}
      onClose={() => {
        setModalPratoOpen(false)
        fecharModal()
      }}
      sx={{
        display: "flex",
        justifyContent: "center",
        height: "maxContent",
        alignItems: "center"
      }}
    >
      <form onSubmit={handleSubmit} className="global-form">
        <Typography>Cadastro prato</Typography>
      </form>
    </Modal>
  )
}

export default RegistrarPrato;