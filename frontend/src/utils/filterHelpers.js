export const citiesFilters = [
  {
    header: 'Endereço',
    children: [
      {
        field: 'cep',
        header: 'CEP',
        relation: 'address'
      },
      {
        field: 'address',
        header: 'Endereço',
        relation: 'address'
      },
      {
        field: 'district',
        header: 'Bairro',
        relation: 'address'
      },
      {
        field: 'number',
        header: 'Número',
        relation: 'address'
      },
      {
        field: 'complement',
        header: 'Complemento',
        relation: 'address'
      }
    ]
  }
];

export const responsiblesFilters = [
  {
    header: 'Responsável',
    children: [
      {
        field: 'name',
        header: 'Nome',
        relation: 'responsible'
      },
      {
        field: 'phone',
        header: 'Telemóvel',
        relation: 'responsible'
      },
      {
        field: 'email',
        header: 'Email',
        relation: 'responsible'
      },
      {
        field: 'role',
        header: 'Função',
        relation: 'responsible'
      },
      {
        field: 'document',
        header: 'Documento',
        relation: 'responsible'
      }
    ]
  }
];

export const contactFilters = [
  {
    header: 'Contacto',
    children: [
      {
        field: 'name',
        header: 'Nome',
        relation: 'contact'
      },
      {
        field: 'phone',
        header: 'Telemóvel',
        relation: 'contact'
      },
      {
        field: 'email',
        header: 'Email',
        relation: 'contact'
      },
      {
        field: 'role',
        header: 'Função',
        relation: 'contact'
      },
      {
        field: 'talk_to',
        header: 'Falar com',
        relation: 'contact'
      }
    ]
  }
];
