export default {
    plugins: [
        {
            name: 'Gray', type: 'pre-processing', description: '灰度转化',
        },
        {
            name: 'Gauss blur', type: 'Image algorithm', description: '高斯滤波', context: [
                {type: 'number', label: '卷积核大小', name: 'ksize', value: 3, specific: { placeholder: '' }},
                {type: 'number', label: '循环次数', name: 'loop', value: 1, specific: { placeholder: '' }},
            ]
        },
        {
            name: 'Pooling', type: 'Image algorithm', description: '池化卷积', context: [
                {type: 'number', label: '卷积核大小', name: 'ksize', value: 2, specific: { placeholder: '' }},
            ]
        },
        {
            name: 'Gradient', type: 'Image algorithm', description: '梯度算子', context: [
                {type: 'number', label: '卷积核大小', name: 'ksize', value: 3, specific: { placeholder: '' }},
            ]
        },
    ]
}