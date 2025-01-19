# RUFPI - Frontent: React + vite + Typescript

Sistema responsivo para que possa ser utilizado em dispositivos moveis, computadores e televisores. Este sistema está vinculado a outros dois sistemas e tem o objetivo conectar funcionários e discentes através da interação entre estes nos cardápios diários feitos no Restaurante Universtário (RU) da Universidade Federal do Piauí (UFPI).

## Aplicação

Desenvolvida pensando em dispositivos que suportem layout de 450px ou mais de largura (Smartphones, computadores e televisores). Ou seja, a aplicação não é responsiva para todos os dispositivos, uma vez que está aplicaçãoé um protótipo para que possa de fato ser desenvolvida em sua completude.

O layout da aplicação é simples levando em consideração ao atual site da UFPI. Os usuários devem se cadastrar para que possam ter aceso à aplicaçaão.

### Tecnologias utilizadas

A aplicação foi desenvolvida no VSCode utilizando projeto React + vite + Typescript. Além disso, foi utilizado `pnpm` como o principal gerenciador de pacotes para a instalação de componentes durante a implementação do sistema, como a instalação dos compontentes do MaterialUI. Logo, para rodar a aplicação, é necessário ter o `pnpm` instalado na máquina.

### Execução

Primeiro é necessário que seja feito a instalaçao das dependências utilizando o comando `pnpm i` e em seguida `pnpm run dev` para a executar a aplicação em modo desenvolvedor.

### Funcionalidades

A aplicação, neste primeiro momento, é usada para:
- Comprovar que o discente está com cadastro válido sem precisar entrar no SIGAA;
- Gerenciar carteira digital de fichas do RU da universidade;
- Visualizar o cardápio do dia, podendo ter comentários de nutricionistas;
