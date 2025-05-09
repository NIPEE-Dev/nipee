import React, { useState } from 'react';
import {
    Box,
    Checkbox,
    CheckboxGroup,
    Stack,
    Text,
    Button,
} from '@chakra-ui/react';

const MultiSelect = ({ options = [], onChange }) => {
    const [selectedValues, setSelectedValues] = useState([]);

    const handleChange = (values) => {
        setSelectedValues(values);
        if (onChange) {
            onChange(values);
        }
    };

    return (
        <Box>
            <Text fontSize="lg" mb={2}>
                Select Options
            </Text>
            <CheckboxGroup value={selectedValues} onChange={handleChange}>
                <Stack spacing={2}>
                    {options.map((option) => (
                        <Checkbox key={option.value} value={option.value}>
                            {option.label}
                        </Checkbox>
                    ))}
                </Stack>
            </CheckboxGroup>
            <Button mt={4} onClick={() => console.log(selectedValues)}>
                Log Selected Values
            </Button>
        </Box>
    );
};

export default MultiSelect;