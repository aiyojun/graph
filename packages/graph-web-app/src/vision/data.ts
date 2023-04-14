export default {
    plugins: [
        {
            color: '#03c9d5', name: 'grayscale map\uD83D\uDE00', type: 'preprocessing', description: '灰度转化',
        },
        {
            color: '#f34676', name: 'gauss blur', type: 'image algorithm', description: 'gauss blur', context: [
                {type: 'number', label: 'kernel size', name: 'ksize', value: 3, specific: {placeholder: ''}},
                {type: 'number', label: 'loop count', name: 'loop', value: 1, specific: {placeholder: ''}},
            ]
        },
        {
            color: '#ef7642', name: 'pooling', type: 'image algorithm', description: 'pooling', context: [
                {type: 'number', label: 'kernel size', name: 'ksize', value: 2, specific: {placeholder: ''}},
            ]
        },
        {
            color: '#62d000', name: 'gradient evaluation', type: 'image algorithm', description: 'gradient evaluation', context: [
                {type: 'number', label: 'kernel size', name: 'ksize', value: 3, specific: {placeholder: ''}},
            ]
        },
    ]
}