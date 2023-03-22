export const templateJson1 = {
    type: 'VLinearLayout',
    children: [
        { type: 'label', label: 'Login' },
        {
            type: 'VLinearLayout',
            children: [
                {
                    type: 'HLinearLayout',
                    children: [
                        { type: 'input', label: 'Username', prop: 'username', placeholder: 'Please input your name!', required: true },
                        { type: 'radio', label: 'Gender', prop: 'gender', options: [ { label: 'Female', value: 'female' }, { label: 'Male', value: 'male' } ], },
                    ]
                },
                { type: 'select', label: 'Hobby', prop: 'hobby', options: [ { label: 'Basketball', value: 'basketball' }, { label: 'Swimming', value: 'swimming' }, { label: 'Football', value: 'football' } ] },
                { type: 'input', label: 'Password', prop: 'password', placeholder: 'Please input your password!' },
            ]
        },
        {
            type: 'dynamic', label: 'Persons', prop: 'persons',
            children: [
                {
                    type: 'VLinearLayout',
                    children: [
                        {
                            type: 'HLinearLayout',
                            children: [
                                { type: 'input', prop: 'name', label: 'Name' },
                                { type: 'number', prop: 'phone', label: 'Phone' },
                            ]
                        },
                        { type: 'select', prop: 'family', label: 'Family', options: [ { label: 'Father', value: 'father' }, { label: 'Mother', value: 'mother' } ] },
                    ]
                },
            ]
        },
        { type: 'select', label: 'Hobby', prop: 'hobby', options: [ { label: 'Basketball', value: 'basketball' }, { label: 'Swimming', value: 'swimming' }, { label: 'Football', value: 'football' } ] },
    ]
}
export const templateJson2 = {
    type: 'XTablePanel',
    children: [
        { type: 'input', label: 'Username', prop: 'username', placeholder: 'Please input your name!', required: true },
        { type: 'select', label: 'Gender', prop: 'gender', options: [ { label: 'Female', value: 'female' }, { label: 'Male', value: 'male' } ], },
        { type: 'select', label: 'Hobby', prop: 'hobby', options: [ { label: 'Basketball', value: 'basketball' }, { label: 'Swimming', value: 'swimming' }, { label: 'Football', value: 'football' } ] },
        { type: 'input', label: 'Password', prop: 'password', placeholder: 'Please input your password!' },
        // {
        //     type: 'dynamic',
        //     children: [
        //         {
        //             type: 'VLinearLayout',
        //             children: [
        //                 { type: 'input', prop: 'name', label: 'Name', value: 'Simon' },
        //                 { type: 'number', prop: 'phone', label: 'Phone' },
        //                 { type: 'select', prop: 'family', label: 'Family', options: [ { label: 'Father', value: 'father' }, { label: 'Mother', value: 'mother' } ] },
        //             ]
        //         },
        //         {
        //             type: 'VLinearLayout',
        //             children: [
        //                 { type: 'input', prop: 'name', label: 'Name', value: 'Smith' },
        //                 { type: 'number', prop: 'phone', label: 'Phone' },
        //                 { type: 'select', prop: 'family', label: 'Family', options: [ { label: 'Father', value: 'father' }, { label: 'Mother', value: 'mother' } ] },
        //             ]
        //         },
        //         {
        //             type: 'VLinearLayout',
        //             children: [
        //                 { type: 'input', prop: 'name', label: 'Name', value: 'Jane' },
        //                 { type: 'number', prop: 'phone', label: 'Phone' },
        //                 { type: 'select', prop: 'family', label: 'Family', options: [ { label: 'Father', value: 'father' }, { label: 'Mother', value: 'mother' } ] },
        //             ]
        //         },
        //     ]
        // }
    ]
};