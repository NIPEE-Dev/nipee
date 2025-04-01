import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  GridItem,
  Heading,
  SimpleGrid,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import Card from '../components/Card/Card';

const GroupContainer = ({ title, subtitle, children }) => (
  <Box mt={10}>
    <SimpleGrid
      display={{ base: 'initial', md: 'grid' }}
      columns={{ md: 4 }}
      spacing={{ md: 6 }}
    >
      <GridItem colSpan={{ md: 1 }}>
        <Box px={[4, 0]}>
          <Heading fontSize='lg' fontWeight='medium' lineHeight='6'>
            {title}
          </Heading>
          <Text
            mt={1}
            fontSize='sm'
            color={useColorModeValue('gray.600', 'gray.400')}
          >
            {subtitle}
          </Text>
        </Box>
      </GridItem>
      <GridItem mt={[5, null, 0]} colSpan={{ md: 3 }}>
        <Card>{children}</Card>
      </GridItem>
    </SimpleGrid>
  </Box>
);

GroupContainer.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  children: PropTypes.any.isRequired,
};

export default GroupContainer;
