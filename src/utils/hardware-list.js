const h = [{
        label: 'CPU',
        options: [{
                value: '0',
                label: 'CPU only · 2 vCPU · 16 GiB · FREE',
                label_short: '2 vCPU · 16 GiB RAM',
                price: 'Free',
                type: 'CPU basic'
            },
            {
                value: '1',
                label: 'CPU only · 8 vCPU · 32 GiB · 1 LAD per block',
                label_short: '8 vCPU · 32 GiB RAM',
                price: '1 LAD per block',
                type: 'CPU upgrade'
            },
        ],
        options_setting: []
    },
    {
        label: 'GPU',
        options: [{
                value: '2',
                label: 'Nvidia T4 · 4 vCPU · 15 GiB · 20 LAD per block',
                label_short: '4 vCPU · 15 GiB RAM · Nvidia T4',
                price: '20 LAD per block',
                type: 'T4 small'
            },
            {
                value: '3',
                label: 'Nvidia T4 · 8 vCPU · 30 GiB · 30 LAD per block',
                label_short: '8 vCPU · 30 GiB RAM · Nvidia T4',
                price: '30 LAD per block',
                type: 'T4 medium'
            },
            {
                value: '4',
                label: 'Nvidia A10G · 4 vCPU · 15 GiB · 35 LAD per block',
                label_short: '4 vCPU · 15 GiB RAM · Nvidia A10G',
                price: '35 LAD per block',
                type: 'A10G small'
            },
            {
                value: '5',
                label: 'Nvidia A10G · 12 vCPU · 46 GiB · 105 LAD per block',
                label_short: '12 vCPU · 46 GiB RAM · Nvidia A10G',
                price: '105 LAD per block',
                type: 'A10G large'
            },
        ],
        options_setting: [{
                value: '6',
                label: 'Nvidia A100 40GB · 12 vCPU · 142 GiB · * LAD per block',
                label_short: '12 vCPU · 142 GiB RAM · Nvidia A100 40GB',
                price: '* LAD per block',
                type: 'A100 large'
            },
            {
                value: '7',
                label: 'HPU · IPU · ...',
                label_short: 'HPU · IPU · ...',
                price: 'Coming soon',
                type: 'AI Accelerator'
            },
        ]
    },
]
export default h