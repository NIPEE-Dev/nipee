import React from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  Link,
  Divider,
} from "@chakra-ui/react";
import logo from "/src/images/logo.png";

const Termos = () => {
  return (
    <Box bg="gray.50" minH="100vh" py={10} px={{ base: 4, md: 8 }}>
      <VStack spacing={6} maxW="800px" mx="auto" textAlign="justify">
       
        <Box mb={6} textAlign="center">
          <img src={logo} alt="Logo" style={{ width: "200px", margin: "0 auto" }} />
        </Box>

        <Heading as="h1" size="lg" textAlign="center" color="#5931E9">
          Termos e Condições de Uso
        </Heading>
        <Text fontSize="sm" color="gray.500" textAlign="center">
          Última Atualização: 01.02.25
        </Text>

        <Divider />

        <Text>Bem-vindo à nossa plataforma! Antes de utilizar o nosso site, por favor, leia cuidadosamente os Termos e Condições de Uso descritos abaixo. Ao aceder ou utilizar o site, você concorda com estes termos. Caso não concorde com eles, não deve utilizar o site.</Text>

        <VStack spacing={4} align="start">
          <Heading as="h2" size="md" color="#5931E9">
            1. Definições
          </Heading>
          <Text>1.1. Plataforma: Refere-se ao site nipee.org, destinado a conectar estudantes a oportunidades de estágio em Portugal.</Text>
          <Text>1.2. Usuário: Qualquer pessoa que aceda ou utilize a plataforma, incluindo estudantes, empresas e outros visitantes.</Text>
          <Text>1.3. Conteúdo: Qualquer informação, texto, gráficos, fotografias, vídeos ou outros materiais disponibilizados na plataforma.</Text>

          <Heading as="h2" size="md" color="#5931E9">
            2. Acesso e Cadastro
          </Heading>
          <Text>
            2.1. Para utilizar certas funcionalidades do site, o usuário deve criar uma conta, fornecendo informações pessoais verdadeiras,
            precisas e atualizadas.
          </Text>
          <Text>2.2. O uso do site é permitido apenas para maiores de 16 anos ou com autorização expressa de um representante legal.</Text>
          <Text>2.3. Cada usuário é responsável pela segurança da sua conta, incluindo a proteção do nome de usuário e senha.</Text>

          <Heading as="h2" size="md" color="#5931E9">
            3. Uso Aceitável
          </Heading>
          <Text>3.1. O usuário compromete-se a utilizar a plataforma apenas para fins legais e de acordo com a legislação aplicável.</Text>
          <Text>3.2. É proibido:</Text>
          <Text>- Publicar conteúdo falso, enganoso ou ilegal.</Text>
          <Text>- Violar direitos de propriedade intelectual de terceiros.</Text>
          <Text>- Utilizar o site para fins comerciais não autorizados.</Text>

          <Heading as="h2" size="md" color="#5931E9">
            4. Dados Pessoais e Privacidade
          </Heading>
          <Text>
            4.1. A plataforma coleta e processa dados pessoais de acordo com o Regulamento Geral de Proteção de Dados (RGPD).
          </Text>
          <Text>
            4.2. Os dados fornecidos serão utilizados para conectar estudantes e empresas, melhorar os serviços e cumprir obrigações legais.
          </Text>
          <Text>
            4.3. Os usuários têm o direito de acesso, retificação, exclusão ou limitação do processamento dos seus dados.
          </Text>

          <Heading as="h2" size="md" color="#5931E9">
            5. Limitação de Responsabilidade
          </Heading>
          <Text>5.1. A plataforma atua apenas como intermediária entre estudantes e empresas, não garantindo a contratação de estágios.</Text>
          <Text>5.2. Não nos responsabilizamos por:</Text>
          <Text>- Ações de terceiros, incluindo empresas ou outros usuários.</Text>
          <Text>- Erros ou interrupções no funcionamento da plataforma.</Text>

          <Heading as="h2" size="md" color="#5931E9">
            6. Propriedade Intelectual
          </Heading>
          <Text>
            6.1. Todo o conteúdo da plataforma é protegido por direitos autorais e outros direitos de propriedade intelectual.
          </Text>
          <Text>6.2. É proibido copiar, reproduzir ou distribuir qualquer parte do conteúdo sem autorização prévia.</Text>

          <Heading as="h2" size="md" color="#5931E9">
            7. Alterações nos Termos e Condições
          </Heading>
          <Text>7.1. Reservamo-nos o direito de alterar estes Termos e Condições a qualquer momento.</Text>
          <Text>7.2. Alterações significativas serão notificadas aos usuários por meio do site ou de e-mail.</Text>

          <Heading as="h2" size="md" color="#5931E9">
            8. Rescisão
          </Heading>
          <Text>8.1. Podemos suspender ou encerrar o acesso de qualquer usuário que viole estes Termos e Condições.</Text>
          <Text>8.2. O usuário pode encerrar a sua conta a qualquer momento, entrando em contacto com o suporte.</Text>

          <Heading as="h2" size="md" color="#5931E9">
            9. Lei Aplicável e Foro Competente
          </Heading>
          <Text>9.1. Estes Termos e Condições são regidos pelas leis de Portugal.</Text>
          <Text>9.2. Qualquer disputa será resolvida nos tribunais competentes de Lisboa.</Text>

          <Heading as="h2" size="md" color="#5931E9">
            10. Contacto
          </Heading>
          <Text>Se tiver dúvidas ou questões sobre estes Termos e Condições, entre em contacto conosco:</Text>
          <Text>
            E-mail:{" "}
            <Link href="mailto:contacto@nipee.org" color="blue.500">
              contacto@nipee.org
            </Link>
          </Text>
          <Text>Telefone: +351 211 309 985</Text>
        </VStack>

        <Divider />

        <Text fontSize="sm" color="gray.600" textAlign="center">
          Ao continuar a utilizar a nossa plataforma, você confirma que leu, compreendeu e concorda com os nossos Termos e Condições de Uso.
        </Text>
      </VStack>
    </Box>
  );
};

export default Termos;
